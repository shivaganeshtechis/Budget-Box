import React from 'react';
import { Page, Section } from 'react-page-layout';

export default function MyProfile() {
    return (
        <Page layout="public">
			<Section slot="main">
				MyProfile Page
			</Section>
		</Page>
    )
}
