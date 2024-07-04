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
import CompanySelectInput from 'src/components/company/CompanySelectInput';
import { USER_ROLES, USER_ROLES_MAP } from 'src/constants/user';
import useDisclosure from 'src/hooks/useDisclosure';
import type { Company, Permission, UserInput } from 'src/types';
import PermissionsEditor from '../PermissionsEditor/PermissionsEditor';

type Props = {
	isNew: boolean;
	companies?: Company[];
	permissions?: Permission[];
};

const UserFormUser: FC<Props> = ({ isNew, companies = [], permissions = [] }) => {
	const form = useFormContext<UserInput>();

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
					name="companyId"
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
						error={Boolean(form.formState.errors.firstName)}
						fullWidth
						required
						helperText={form.formState.errors.firstName?.message}
						label="Prénom"
						{...form.register('firstName')}
					/>
					<TextField
						error={Boolean(form.formState.errors.lastName)}
						fullWidth
						required
						helperText={form.formState.errors.lastName?.message}
						label="Nom"
						{...form.register('lastName')}
					/>
				</Stack>

				<Stack direction={{ sm: 'row' }} gap={4}>
					<TextField
						error={Boolean(form.formState.errors.email)}
						fullWidth
						required
						helperText={form.formState.errors.email?.message}
						label="Courriel"
						{...form.register('email')}
					/>
					<TextField
						error={Boolean(form.formState.errors.username)}
						fullWidth
						required
						helperText={form.formState.errors.username?.message}
						label="Username"
						{...form.register('username')}
					/>
				</Stack>

				<Stack direction={{ sm: 'row' }} gap={4}>
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
				</Stack>

				<div>
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
								{USER_ROLES.map((role) => (
									<option key={role} value={role}>
										{capitalCase(USER_ROLES_MAP[role].title)}
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
							{permissionsDisclosure.isOpen ? 'Masquer' : 'Afficher'} les permissions
						</Button>

						<Collapse in={permissionsDisclosure.isOpen}>
							<Box mt={2} maxHeight={320} overflow="auto">
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
				</div>

				<Divider />

				<Stack direction={{ sm: 'row' }} gap={4}>
					<TextField
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
						name="hiredAt"
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
										error: Boolean(form.formState.errors.hiredAt),
										helperText: form.formState.errors.hiredAt?.message,
									},
								}}
							/>
						)}
					/>
				</Stack>

				<Controller
					control={form.control}
					name="status"
					render={({ field }) => (
						<FormControlLabel
							label="Actif"
							control={
								<Switch
									checked={field.value === 'active'}
									onChange={(_, value) => field.onChange(value === true ? 'active' : 'inactive')}
								/>
							}
						/>
					)}
				/>
			</CardContent>
		</Card>
	);
};

export default UserFormUser;
