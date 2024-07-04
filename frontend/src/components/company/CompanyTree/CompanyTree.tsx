import type { FC } from 'react';
import React, { useCallback, useMemo } from 'react';
import type { SxProps } from '@mui/material/styles';
import { useTreeItem2Utils } from '@mui/x-tree-view/hooks/useTreeItem2Utils';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem2, type TreeItem2Props } from '@mui/x-tree-view/TreeItem2';
import type { UseTreeItem2ContentSlotOwnProps } from '@mui/x-tree-view/useTreeItem2';
import { Icons } from 'src/components/base/Icons';
import type { Company, ResultType } from 'src/types';

type Props = {
	data: ResultType<'companyTable', { subCompanies: true }>;
	defaultSelected: Company['id'] | null;
	sx?: SxProps;
	onSelect: (company: Company) => void;
};

/**
 * Converts a Company object in a format that 'RichTreeView' understands.
 */
function convertCompanyObj(obj: Props['data']) {
	const replaceObj = (obj: Props['data']) => {
		return {
			id: obj.id,
			label: obj.name,
			children:
				obj.subCompanies?.map((company) => {
					return replaceObj(company);
				}) ?? [],
		};
	};

	return [replaceObj(obj)];
}

const CompanyTree: FC<Props> = ({ data: companyTree, defaultSelected, sx, onSelect }) => {
	// TODO: let's just use regular TreeView and implement our own recursive children render
	const items = useMemo(() => convertCompanyObj(companyTree), [companyTree]);

	// TODO: need a better logic
	const defaultExpandedItems = useMemo(
		() => [
			companyTree.id,
			...companyTree.subCompanies.map((v) => v.id).filter((v) => v === defaultSelected),
		],
		[companyTree],
	);

	const handleItemsChange = useCallback((event: unknown, itemId: string | null) => {
		onSelect({ id: itemId });
	}, []);

	return (
		<RichTreeView
			sx={sx}
			items={items}
			defaultExpandedItems={defaultExpandedItems}
			defaultSelectedItems={defaultSelected}
			onSelectedItemsChange={handleItemsChange}
			slots={{
				endIcon: Icons.company,
				item: CustomTreeItem,
			}}
			slotProps={{
				item: {
					sx: {
						color: (theme) => theme.palette.neutral[50],
						'&.Mui-selected': {
							color: (theme) => theme.palette.neutral[50],
							backgroundColor: (theme) => theme.palette.secondary.main,
							'& .MuiListItemIcon-root': {
								color: (theme) => theme.palette.primary.main,
							},
						},
					},
				},
			}}
		/>
	);
};

export default CompanyTree;

/**
 * Custom tree item that prevent expanding it's children when not clicking on expand icon.
 */
const CustomTreeItem = React.forwardRef(function MyTreeItem(
	props: TreeItem2Props,
	ref: React.Ref<HTMLLIElement>,
) {
	const { interactions } = useTreeItem2Utils({
		itemId: props.itemId,
		children: props.children,
	});

	const handleContentClick: UseTreeItem2ContentSlotOwnProps['onClick'] = (event) => {
		event.defaultMuiPrevented = true;
		interactions.handleSelection(event);
	};

	const handleIconContainerClick = (event: React.MouseEvent) => {
		interactions.handleExpansion(event);
	};

	return (
		<TreeItem2
			{...props}
			ref={ref}
			slotProps={{
				content: { onClick: handleContentClick },
				iconContainer: { onClick: handleIconContainerClick },
			}}
		/>
	);
});
