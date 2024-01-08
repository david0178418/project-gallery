import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

interface Props {
	obj: any;
}

export
function Debug(props: Props) {
	const[hidden, setHidden] = useState(true);

	return (
		<Box>
			<Button onClick={() => setHidden(!hidden)}>
				Debug
			</Button>
			{!hidden && (
				<pre>
					{JSON.stringify(props.obj, null, 4)}
				</pre>
			)}
		</Box>
	);
}
