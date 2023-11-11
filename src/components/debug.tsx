import { useState } from 'react';
import { Button } from './ui/button';
interface Props {
	obj: any;
}

export
function Debug(props: Props) {
	const[hidden, setHidden] = useState(true);

	return (
		<div>
			<Button onClick={() => setHidden(!hidden)}>
				Debug
			</Button>
			{!hidden && (
				<pre>
					{JSON.stringify(props.obj, null, 4)}
				</pre>
			)}
		</div>
	);
}
