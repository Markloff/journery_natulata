import React from 'react';
import { Button, List, ListItem, Box, Link } from '@chakra-ui/react';


export type SideBarProps = {
	data: SideBarItem[];
}

type SideBarItem = {
	name: string;
	href: string;
}

export const SideBar: React.FC<SideBarProps> = (props) => {
	const { data } = props;
	return (
		<Box width={'200px'}>
			<List>
				{data.map(item => {
					const { name, href } = item;
					return (
						<ListItem key={name+href}>
							<Link href={href}>
								<Button>
									{name}
								</Button>
							</Link>
						</ListItem>
					)
				})}
			</List>
		</Box>
	)
}
