'use client';
import {
	ReactNode, useEffect, useState,
} from 'react';
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	DragOverlay,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';

interface Props<T extends { [key in K]: string | number }, K extends keyof T = keyof T> {
	items: T[];
	identifier: K;
	onUpdate(items: T[]): void;
	ItemComponent(props: {item: T, i?: number}): ReactNode;
}

export default
function Foo<T extends { [key in K]: string | number }, K extends keyof T = keyof T>(props: Props<T, K>) {
	const {
		items: rawItems,
		identifier,
		onUpdate,
		ItemComponent,
	} = props;

	const [activeId, setActiveId] = useState<number | string | null>(null);
	const [items, setItems] = useState(rawItems.map(i => ({
		id: i[identifier],
		...i,
	})));
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
	);

	useEffect(() => {
		setItems(() =>
			rawItems.map(i => ({
				id: i[identifier],
				...i,
			}))
		);
	}, [rawItems]);

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragStart={e => setActiveId(e.active.id)}
			onDragEnd={e => {
				const {
					active,
					over,
				} = e;

				if(!over || active.id === over?.id) {
					return;
				}

				const oldIndex = items.findIndex(i => i.id === active.id);
				const newIndex = items.findIndex(i => i.id === over.id);
				const result = arrayMove(items, oldIndex, newIndex);

				setItems(result);

				onUpdate(result);
			}}
		>
			<SortableContext
				items={items}
				strategy={verticalListSortingStrategy}
			>
				{items.map((item, i) => (
					<ItemComponent key={item[identifier]} item={item} i={i} />
				))}
			</SortableContext>
			<DragOverlay>
				{activeId ? <SortableItemWrapper id={activeId} /> : null}
			</DragOverlay>
		</DndContext>
	);
}

export
function remap<T, U extends T & { id: string | number }>(modifiedArray: U[], originalArray: T[], identifier: keyof T) {
	return modifiedArray
		.map(i => i[identifier])
		.map(id => originalArray.find(i => i[identifier] === id as keyof T)); // is this correct?
}

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box } from '@mui/material';

export function SortableItemWrapper(props: any) {
	const { children } = props;
	const {
		listeners,
		setNodeRef,
		transform,
		transition,
	} = useSortable({ id: props.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<Box
			ref={setNodeRef}
			style={style}
			sx={{
				touchAction: 'none',
				cursor: 'move',
			}}
			{...listeners}
		>
			{children}
		</Box>
	);
}
