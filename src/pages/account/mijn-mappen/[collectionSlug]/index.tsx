import { yupResolver } from '@hookform/resolvers/yup';
import { Button, ContentInput, FormControl } from '@meemoo/react-components';
import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { CREATE_COLLECTION_FORM_SCHEMA } from '@account/const';
import { useGetCollections } from '@account/hooks/get-collections';
import { AccountLayout } from '@account/layouts';
import { collectionsService } from '@account/services/collections';
import { Collection, CreateCollectionFormState } from '@account/types';
import { withAuth } from '@auth/wrappers/with-auth';
import { withI18n } from '@i18n/wrappers';
import { Icon, ListNavigationItem } from '@shared/components';
import { SidebarLayoutTitle } from '@shared/components/SidebarLayoutTitle';
import { ROUTES } from '@shared/const';
import { capitalise } from '@shared/helpers';
import { SidebarLayout } from '@shared/layouts/SidebarLayout';
import { toastService } from '@shared/services';
import { createPageTitle } from '@shared/utils';

type ListNavigationCollectionItem = ListNavigationItem & Collection;

const AccountMyCollections: NextPage = () => {
	const { t } = useTranslation();
	const router = useRouter();
	const { collectionSlug } = router.query;

	/**
	 * Form
	 */

	const defaultName = t('pages/account/mijn-mappen/collection-slug/index___nieuwe-map-aanmaken');

	const {
		control,
		formState: { errors },
		handleSubmit,
		setValue,
		resetField,
	} = useForm<CreateCollectionFormState>({
		resolver: yupResolver(CREATE_COLLECTION_FORM_SCHEMA()),
		defaultValues: {
			name: defaultName,
		},
	});

	/**
	 * Data
	 */

	const { data: collections, isFetching, refetch } = useGetCollections();
	const sidebarLinks: ListNavigationCollectionItem[] = useMemo(
		() =>
			(collections?.items || []).map((collection) => {
				const href = `${ROUTES.myCollections}/${collection.name.toLowerCase()}`;

				return {
					...collection,
					node: ({ linkClassName }) => (
						<Link href={href}>
							<a className={linkClassName} title={collection.name}>
								{collection.name}
							</a>
						</Link>
					),
					active: collection.name.toLowerCase() === collectionSlug,
				};
			}),
		[collections, collectionSlug]
	);

	/**
	 * Computed
	 */

	const activeCollection = useMemo(
		() => sidebarLinks.find((link) => link.active),
		[sidebarLinks]
	);

	/**
	 * Events
	 */

	const resetForm = () => resetField('name');
	const clearForm = () => setValue('name', '');

	const onFormSubmit = () => {
		handleSubmit<CreateCollectionFormState>((values) => {
			collectionsService.create(values).then(() => {
				refetch();

				toastService.notify({
					title: t(
						'pages/account/mijn-mappen/collection-slug/index___name-is-aangemaakt',
						values
					),
					description: t(
						'pages/account/mijn-mappen/collection-slug/index___je-nieuwe-map-is-succesvol-aangemaakt'
					),
				});
			});
		})();
	};

	return (
		<>
			<Head>
				<title>
					{createPageTitle(
						t('pages/account/mijn-mappen/index___mijn-mappen') +
							` | ${capitalise(collectionSlug)}`
					)}
				</title>

				<meta
					name="description"
					content={t('pages/account/mijn-mappen/index___mijn-mappen-meta-omschrijving')}
				/>
			</Head>

			<AccountLayout className="p-account-my-collections">
				<SidebarLayout
					color="platinum"
					sidebarTitle={t(
						'pages/account/mijn-mappen/collection-slug/index___mijn-mappen'
					)}
					sidebarLinks={[
						...sidebarLinks,
						{
							id: 'p-account-my-collections__new-collection',
							variants: ['c-list-navigation__item--no-interaction'],
							node: (
								<FormControl className="u-px-24" errors={[errors.name?.message]}>
									<Controller
										name="name"
										control={control}
										render={({ field }) => (
											<ContentInput
												{...field}
												onClose={resetForm}
												onOpen={clearForm}
												onConfirm={onFormSubmit}
												iconStart={
													<Button
														variants={['platinum', 'sm']}
														icon={<Icon name="plus" />}
													/>
												}
												nodeSubmit={
													<Button
														variants={['black', 'sm']}
														icon={<Icon name="check" />}
													/>
												}
												nodeCancel={
													<Button
														variants={['silver', 'sm']}
														icon={<Icon name="times" />}
													/>
												}
											/>
										)}
									/>
								</FormControl>
							),
							hasDivider: true,
						},
					]}
				>
					<div className="l-container u-mt-64 u-mb-48">
						<SidebarLayoutTitle>
							{isFetching ? capitalise(collectionSlug) : activeCollection?.name}
						</SidebarLayoutTitle>
					</div>
				</SidebarLayout>
			</AccountLayout>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default withAuth(AccountMyCollections);
