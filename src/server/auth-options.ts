import { compare } from 'bcryptjs';
import CredentialsProvider from 'next-auth/providers/credentials';
import { AuthProviders, UserRoles } from '@common/constants';
import { cookies, headers } from 'next/headers';
import { NextAuthOptions, getServerSession as originalGetServerSession } from 'next-auth';
import { cache } from 'react';
import {
	fetchUser,
	getUserFromKey,
	updateLastLogin,
} from '@server/queries';

const { NEXTAUTH_SECRET } = process.env;

export
const getServerSession = cache(async () => {
	console.log('called server session');
	// Original code just wraps passing auth
	// return originalGetServerSession(authOptions);

	// Hack to get around `Invariant: Method expects to have requestAsyncStorage, none available`
	// Found here:
	// https://github.com/nextauthjs/next-auth/issues/7486#issuecomment-1543747325
	const req = {
		headers: Object.fromEntries(await headers()),
		cookies: Object.fromEntries(
			(await cookies())
				.getAll()
				.map((c) => [c.name, c.value]),
		),
	};
	const res = {
		getHeader() {},
		setCookie() {},
		setHeader() {},
	};

	// @ts-ignore - The type used in next-auth for the req object doesn't match, but it still works
	return originalGetServerSession(req, res, authOptions);
});

export
const authOptions: NextAuthOptions = {
	// https://next-auth.js.org/configuration/providers
	providers: [
		CredentialsProvider({
			id: AuthProviders.OneClick,
			name: 'Magic Link',
			credentials: { key: { type: 'hidden' } },
			async authorize(credentials) {
				console.log('called OneClick authorize');
				if(!credentials) {
					return null;
				}

				const { key } = credentials;

				try {
					const user = await getUserFromKey(key);

					if(!user?._id) {
						return null;
					}

					updateLastLogin(user._id);

					return {
						id: user._id.toString(),
						username: user.username,
						email: user.email,
						role: user.role || UserRoles.User,
					};
				} catch(e) {
					console.error('Auth Error:', e);
					return null;
				}
			},
		}),
		CredentialsProvider({
			id: AuthProviders.Creds,
			name: 'Username',
			// The credentials is used to generate a suitable form on the sign in page.
			// You can specify whatever fields you are expecting to be submitted.
			// e.g. domain, username, password, 2FA token, etc.
			// You can pass any HTML attribute to the <input> tag through the object.
			credentials: {
				username: {
					label: 'Username',
					type: 'text',
					placeholder: 'username',
				},
				email: {
					label: 'Email',
					type: 'email',
					placeholder: 'email',
				},
				password: {
					label: 'Password',
					type: 'password',
				},
			},
			async authorize(credentials) {
				console.log('called Creds authorize');
				if(!credentials) {
					return null;
				}

				const {
					username: usernameOrEmail,
					password,
				} = credentials;

				try {
					const user = await fetchUser(usernameOrEmail);

					if(!(user?._id && await compare(password, user.hash))) {
						return null;
					}

					updateLastLogin(user._id);

					return {
						id: user._id?.toString(),
						username: user.username,
						email: user.email,
						role: user.role || UserRoles.User,
					};
				} catch(e) {
					console.error('Auth Error:', e);
					return null;
				}
			},
		}),
		// EmailProvider({
		//   server: process.env.EMAIL_SERVER,
		//   from: process.env.EMAIL_FROM,
		// }),
		// AppleProvider({
		//   clientId: process.env.APPLE_ID,
		//   clientSecret: {
		//     appleId: process.env.APPLE_ID,
		//     teamId: process.env.APPLE_TEAM_ID,
		//     privateKey: process.env.APPLE_PRIVATE_KEY,
		//     keyId: process.env.APPLE_KEY_ID,
		//   },
		// }),
		// TwitterProvider({
		// 	clientId: process.env.TWITTER_ID,
		// 	clientSecret: process.env.TWITTER_SECRET,
		// }),
	],
	// Database optional. MySQL, Maria DB, Postgres and MongoDB are supported.
	// https://next-auth.js.org/configuration/databases
	//
	// Notes:
	// * You must install an appropriate node_module for your database
	// * The Email provider requires a database (OAuth providers do not)
	// database: process.env.DATABASE_URL,

	// The secret should be set to a reasonably long random string.
	// It is used to sign cookies and to sign and encrypt JSON Web Tokens, unless
	// a separate secret is defined explicitly for encrypting the JWT.
	secret: NEXTAUTH_SECRET,

	session: {
		// Use JSON Web Tokens for session instead of database sessions.
		// This option can be used with or without a database for users/accounts.
		// Note: `strategy` should be set to 'jwt' if no database is used.
		strategy: 'jwt',

		// Seconds - How long until an idle session expires and is no longer valid.
		maxAge: 30 * 24 * 60 * 60, // 30 days

		// Seconds - Throttle how frequently to write to database to extend a session.
		// Use it to limit write operations. Set to 0 to always update the database.
		// Note: This option is ignored if using JSON Web Tokens
		// updateAge: 24 * 60 * 60, // 24 hours
	},

	// JSON Web tokens are only used for sessions if the `strategy: 'jwt'` session
	// option is set - or by default if no database is specified.
	// https://next-auth.js.org/configuration/options#jwt
	jwt: {
		// Set to true to use encryption (default: false)
		// @ts-ignore TODO Figure out type error. Is this deprecated or is type wrong?
		encryption: true,
		// You can define your own encode/decode functions for signing and encryption
		// if you want to override the default behaviour.
		// encode: async ({ secret, token, maxAge }) => {},
		// decode: async ({ secret, token, maxAge }) => {},
	},

	// You can define custom pages to override the built-in ones. These will be regular Next.js pages
	// so ensure that they are placed outside of the '/api' folder, e.g. signIn: '/auth/mycustom-signin'
	// The routes shown here are the default URLs that will be used when a custom
	// pages is not specified for that route.
	// https://next-auth.js.org/configuration/pages
	// pages: {
	// signIn: '/auth/signin',  // Displays signin buttons
	// signOut: '/auth/signout', // Displays form with sign out button
	// error: '/auth/error', // Error code passed in query string as ?error=
	// verifyRequest: '/auth/verify-request', // Used for check email page
	// newUser: null, // If set, new users will be directed here on first sign in
	// },

	// Callbacks are asynchronous functions you can use to control what happens
	// when an action is performed.
	// https://next-auth.js.org/configuration/callbacks
	callbacks: {
		// async signIn({ user, account, profile, email, credentials }) { return true },
		// async redirect({ url, baseUrl }) { return baseUrl },
		// async session({ session, token, user }) { return session },
		async jwt(args) {
			const {
				token,
				user,
			} = args;

			if(user) {
				token.user = user;
			}

			return token;
		},
		async session(args) {
			const {
				session,
				token,
			} = args;

			session.user = token.user;

			updateLastLogin(session.user.id);

			return session;
		},
	},

	// Events are useful for logging
	// https://next-auth.js.org/configuration/events
	// async signIn(message) { /* on successful sign in */ },
	// async signOut(message) { /* on signout */ },
	// async createUser(message) { /* user created */ },
	// async updateUser(message) { /* user updated - e.g. their email was verified */ },
	// async linkAccount(message) { /* account (e.g. Twitter) linked to a user */ },
	// async session(message) { /* session is active */ },
	events: {},

	// Enable debug messages in the console if you are having problems
	debug: false,
};
