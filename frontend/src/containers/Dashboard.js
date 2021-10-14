import React, { createRef, useEffect, useState } from "react";
import { Page, Section } from 'react-page-layout';
import Breadcrumbs from "../components/default/SecondNavBar";
import SingupForm from "../components/landing-page/SignupForm";

export default function Report() {
	return (
		<Page layout="default">
			<Section slot="breadcrumbs">
				<Breadcrumbs title="Dashboard" />
			</Section>
			<Section slot="main">
				<div className="dashboard">
					<div className="dashboard-left">
						<div className="content container--chart">
							<div className="inner-container--chart">
								<p className="chart-title">Last 3 months report</p>
								<div>
									<span className="label-bar expense-amount">Expenditure</span>
									<span className="label-bar income-amount">Income</span>
								</div>
								<table id="q-graph">
									<tbody>
										<tr className="qtr" id={`q${1}`} key={`graph-${1}`}>
											<th scope="row">{"2021/10"}</th>
											<td
												className="tooltip expense-bar bar"
												style={{ height: 200 }}
											>
												<span className="tooltiptext">$200</span>
											</td>
											<td
												className="tooltip income-bar bar"
												style={{ height: 150 }}
											>
												<span className="tooltiptext">$150</span>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
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
