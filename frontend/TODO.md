# TODO LIST

### Priority:

- [x] Calendar: fix multiple bugs
- [x] Calendar: add daily agenda view (with driver/towing details)
- [x] Calendar: add quick actions for additional infos
- [x] Calendar: auto-guess event title
- [x] Calendar: support copy-paste (ctrl+c/ctrl+v)
- [x] Calendar: block events if creation/update permission not allowed
- [x] Handle permissions on server actions (hide calendar delete button & restrict event form)
- [ ] Only allow certain users to customize permissions
- [x] Refactor to Drizzle + Server Actions & replace `isActive` with `status`
- [x] Implement companies multitenancy
- [x] Add company selection in multiple forms ("appartenant à...")
- [ ] Improve delete confirmation dialog
- [ ] Show a confirm dialog before leaving an unsaved form
- [x] Fix side-nav bug when `isOpen` and `isDesktop` are false
- [x] Auto close side-nav on mobile navigation
- [ ] Add phone inputs
- [ ] Add address inputs with autocompletion
- [x] Clients: add `first_name` and `last_name` like users
- [x] Allow sub-companies in frontend
- [ ] Refactor price conditions to be handled in services; UI idea: prices dragged into conditions

### Call Forms:

- [ ] Remove mandatory destination
- [ ] Add "Lieu de la panne" field
- [ ] "Lieu de départ" field: use a dropdown of companies
- [ ] Vehicle to tow: add a note field
- [ ] New form: select driver = set directly assigned (not pending)
- [ ] Use side navigation instead of multiple tables on the same page
- [ ] Add "bill to" field above client, referring to a client (customer)

### Clients:

- [ ] Add service preferences to prioritize preferred services in the call form service pick dropdown
- [ ] Add fields: Business Owner, accounting information (example group: Contact)

### Users:

- [ ] Add "Courte description" field
- [ ] Driver: add capabilities (e.g., T4, T8, etc.)

### Towings:

- [ ] Add "Courte description" field
- [ ] Separate towing characteristics from capacity (towing itself vs. what it can transport)

### Invoices:

- [ ] Should not be modifiable (e.g., service update should not affect the invoice and its price)

### Others:

- [ ] Rename `companies` table to `tenants`
- [ ] Remove `material-table-core`
- [ ] Fix letters sent on input with type="number" (zod validation bug)
- [ ] Recheck custom `zodErrorMap` with `issue.expected === 'number'`
- [x] User contacts: O2M relation (delete contacts when user is deleted)
- [x] Secure non-super-admin companies' access
- [ ] Cleanup `DriverSelectorModal` form logic
- [ ] Fix react-hook-form dirty fields bug: `undefined` in zod property schema causes issues
- [x] Use secure-only cookies instead of `js-cookie`
- [ ] Add generic types to entities to include relations easily (e.g., `User<{contacts: true}>`)
- [ ] Improve caching: remove `revalidatePath` everywhere and use `next`'s `unstable_cache` with `revalidatePath`
- [ ] Update form actions to return an error message and notify the client, instead of just throwing an error
