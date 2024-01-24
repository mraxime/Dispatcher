import { useEffect, type FC } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	Collapse,
	Divider,
	FormControlLabel,
	Stack,
	SvgIcon,
	Switch,
	TextField,
	Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { capitalCase } from 'change-case';
import { Controller, useFormContext } from 'react-hook-form';

import { Icons } from 'src/components/base/Icons';
import CompanySelectInput from 'src/components/companies/CompanySelectInput';
import useDisclosure from 'src/hooks/useDisclosure';
import type { NewUserForm } from 'src/lib/schemas/user.schema';
import type { Company, Permission, Role } from 'src/lib/types/directus';
import PermissionsEditor from '../PermissionsEditor/PermissionsEditor';

type Props = {
	isNew: boolean;
	companies?: Company[];
	roles?: Role[];
	permissions?: Permission[];
};

const UserFormUser: FC<Props> = ({ isNew, companies = [], roles = [], permissions = [] }) => {
	const form = useFormContext<NewUserForm>();

	const permissionsDisclosure = useDisclosure(false);
	const roleChanged = form.formState.dirtyFields.role;

	useEffect(() => {
		if (roleChanged) permissionsDisclosure.open();
	}, [roleChanged]);

	return (
		<Card>
			<CardHeader
				title={
					<Stack direction="row" alignItems="center" spacing={1}>
						<SvgIcon color="primary" fontSize="small">
							<Icons.user />
						</SvgIcon>
						<Typography variant="h6">Compte utilisateur</Typography>
					</Stack>
				}
			/>
			<Divider />
			<CardContent component={Stack} spacing={4}>
				<Controller
					name="company"
					control={form.control}
					render={({ field }) => (
						<CompanySelectInput
							{...field}
							label="Appartient à"
							items={companies}
							onSelect={(company) => field.onChange(company.id)}
						/>
					)}
				/>

				<Stack direction={{ sm: 'row' }} gap={4}>
					<TextField
						autoFocus={isNew}
						error={Boolean(form.formState.errors.first_name)}
						fullWidth
						required
						helperText={form.formState.errors.first_name?.message}
						label="Prénom"
						{...form.register('first_name')}
					/>
					<TextField
						error={Boolean(form.formState.errors.last_name)}
						fullWidth
						required
						helperText={form.formState.errors.last_name?.message}
						label="Nom"
						{...form.register('last_name')}
					/>
				</Stack>

				<TextField
					error={Boolean(form.formState.errors.email)}
					fullWidth
					required
					helperText={form.formState.errors.email?.message}
					label="Courriel"
					{...form.register('email')}
				/>

				<div>
					{roles && (
						<>
							<Controller
								name="role"
								control={form.control}
								render={({ field }) => (
									<TextField
										error={Boolean(form.formState.errors.role)}
										fullWidth
										required
										helperText={form.formState.errors.role?.message}
										label="Role"
										select
										SelectProps={{
											...field,
											native: true,
										}}
									>
										{roles.map((role) => (
											<option key={role.id} value={role.id}>
												{capitalCase(role.name)}
											</option>
										))}
									</TextField>
								)}
							/>

							<Stack mt={2.5}>
								<Button
									onClick={permissionsDisclosure.toggle}
									variant="text"
									size="small"
									sx={{
										mx: 'auto',
										backgroundColor: (theme) =>
											permissionsDisclosure.isOpen ? theme.palette.primary.alpha4 : undefined,
									}}
									endIcon={
										<ArrowDropDownIcon
											sx={{
												transform: permissionsDisclosure.isOpen ? 'rotate(-180deg)' : undefined,
											}}
										/>
									}
								>
									Permissions avancées
								</Button>

								<Collapse in={permissionsDisclosure.isOpen}>
									<Box mt={2} maxHeight={265} overflow="auto">
										<Controller
											name="permissions"
											control={form.control}
											render={({ field }) => (
												<PermissionsEditor
													data={permissions}
													selected={field.value}
													onChange={field.onChange}
												/>
											)}
										/>
									</Box>
								</Collapse>
							</Stack>
						</>
					)}
				</div>

				<Divider />

				<Stack direction={{ sm: 'row' }} gap={4}>
					<TextField
						required
						error={Boolean(form.formState.errors.phone)}
						fullWidth
						helperText={form.formState.errors.phone?.message}
						label="Téléphone"
						{...form.register('phone')}
					/>
					<TextField
						error={Boolean(form.formState.errors.ext)}
						fullWidth
						helperText={form.formState.errors.ext?.message}
						label="Poste"
						{...form.register('ext')}
					/>
				</Stack>

				<Stack direction={{ sm: 'row' }} gap={4}>
					<Controller
						control={form.control}
						name="birthday"
						render={({ field }) => (
							<DatePicker
								value={field.value}
								onChange={field.onChange}
								slotProps={{
									textField: {
										label: 'Date de naissance',
										fullWidth: true,
										name: field.name,
										onBlur: field.onBlur,
										error: Boolean(form.formState.errors.birthday),
										helperText: form.formState.errors.birthday?.message,
									},
								}}
							/>
						)}
					/>
					<Controller
						control={form.control}
						name="hireday"
						render={({ field }) => (
							<DatePicker
								value={field.value}
								onChange={field.onChange}
								slotProps={{
									textField: {
										label: "Date d'embauche",
										fullWidth: true,
										name: field.name,
										onBlur: field.onBlur,
										error: Boolean(form.formState.errors.hireday),
										helperText: form.formState.errors.hireday?.message,
									},
								}}
							/>
						)}
					/>
				</Stack>

				<TextField
					error={Boolean(form.formState.errors.password)}
					fullWidth
					required={isNew}
					helperText={form.formState.errors.password?.message}
					label={isNew ? 'Mot de passe' : 'Nouveau mot de passe'}
					type="password"
					{...form.register('password')}
				/>

				<TextField
					error={Boolean(form.formState.errors.passwordConfirm)}
					fullWidth
					required={isNew}
					helperText={form.formState.errors.passwordConfirm?.message}
					label="Confirmation"
					type="password"
					{...form.register('passwordConfirm')}
				/>

				<Controller
					control={form.control}
					name="blocked"
					render={({ field }) => (
						<FormControlLabel
							label="Bloquer l'utilisateur"
							control={
								<Switch checked={field.value} onChange={(_, value) => field.onChange(value)} />
							}
						/>
					)}
				/>
			</CardContent>
		</Card>
	);
};

export default UserFormUser;
