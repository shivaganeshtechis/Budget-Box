import React, { createRef, useEffect, useState } from "react";
import { Page, Section } from 'react-page-layout';

export default function Report() {

	return (
		<Page layout="default">
			<Section slot="main">
				<div className="dashboard">
					<div className="dashboard-left">

					</div>
					<div className="dashboard-right">
						<div className="dashboard-right-top"></div>
						<div className="dashboard-right-bottom"></div>
					</div>
				</div>
			</Section>
		</Page>
	);
}
