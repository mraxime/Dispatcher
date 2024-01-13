import { useCallback } from 'react';
import MaterialTable, { type MaterialTableProps } from '@material-table/core';

import CustomMaterialTableToolbar from './CustomMaterialTableToolbar';

const CustomMaterialTable = <T extends object>(
	props: MaterialTableProps<T> & { onRefresh?: () => void },
) => {
	const Toolbar = useCallback(
		() => (
			<CustomMaterialTableToolbar
				searchText={props.options?.searchText}
				onSearch={props.onSearchChange}
				onRefresh={props.onRefresh}
			/>
		),
		[],
	);

	return (
		<MaterialTable
			localization={{
				body: {
					emptyDataSourceMessage: 'Aucune donnée',
					addTooltip: 'Ajouter',
					deleteTooltip: 'Supprimer',
					editTooltip: 'Editer',
					filterRow: {
						filterTooltip: 'Filtrer',
					},
					editRow: {
						deleteText: 'Voulez-vous supprimer cette rangée ?',
						cancelTooltip: 'Annuler',
						saveTooltip: 'Enregistrer',
					},
				},
				grouping: {
					placeholder: "Tirer l'entête ...",
					groupedBy: 'Grouper par:',
				},
				header: {
					actions: 'Actions',
				},
				pagination: {
					labelDisplayedRows: '{from}-{to} de {count}',
					labelRows: '', // 'rangées'
					labelRowsPerPage: 'rangées par page:',
					firstAriaLabel: 'Première page',
					firstTooltip: 'Première page',
					previousAriaLabel: 'Page précédente',
					previousTooltip: 'Page précédente',
					nextAriaLabel: 'Page suivante',
					nextTooltip: 'Page suivante',
					lastAriaLabel: 'Dernière page',
					lastTooltip: 'Dernière page',
				},
				toolbar: {
					addRemoveColumns: 'Ajouter ou supprimer des colonnes',
					nRowsSelected: '{0} rangée(s) sélectionée(s)',
					showColumnsTitle: 'Voir les colonnes',
					showColumnsAriaLabel: 'Voir les colonnes',
					exportTitle: 'Exporter',
					exportAriaLabel: 'Exporter',
					exportCSVName: 'Exporter en CSV',
					searchTooltip: 'Recherche',
					searchPlaceholder: 'Recherche...',
				},
			}}
			{...props}
			components={{
				Toolbar,
				...props.components,
			}}
			options={{
				actionsColumnIndex: -1,
				actionsCellStyle: {
					padding: '24px 16px',
				},
				pageSize: 10,
				pageSizeOptions: [10, 20, 50],
				maxBodyHeight: 480, // 540
				showTitle: false,
				draggable: false,
				debounceInterval: 250,
				...props.options,
				searchText: '', // Do not touch
			}}
		/>
	);
};

export default CustomMaterialTable;
