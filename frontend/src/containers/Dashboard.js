import React, { useEffect } from 'react';
import { Page, Section } from 'react-page-layout';
import { useDispatch, useSelector } from 'react-redux';

import PieChart from '../components/dashboard/PieChart';
import Breadcrumbs from '../components/default/SecondNavBar';
import { fetchExpenseReport } from '../reducks/transactions/operations';
import { getExpenseReport } from '../reducks/transactions/selectors';

export default function Report() {

	const dispatch = useDispatch();
    const selector = useSelector((state) => state);
    const expenseReports = getExpenseReport(selector);

    useEffect(() => {
        dispatch(fetchExpenseReport());
		// eslint-disable-next-line
    }, []);

    console.log("expenseReports",expenseReports);

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
								<div>
									<span className="label-bar expense-amount">Expenditure</span>
									<span className="label-bar income-amount">Income</span>
								</div>
								<div className="bottom-line"></div>
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
										<tr className="qtr" id={`q${2}`} key={`graph-${2}`}>
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
										<tr className="qtr" id={`q${3}`} key={`graph-${3}`}>
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
										<tr className="qtr" id={`q${4}`} key={`graph-${4}`}>
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
						<div className="dashboard-right-top">
							<div className="dashboard-right-top-container">
								<div className="dashboard-right-title">Monthly budget</div>
								<div>Calculation of last 4 months expense will <br /> be your Average budget.</div>
								<div className="font-size-28 mt-2">Budget ${expenseReports.budget}</div>
								<div className="font-size-28">Expense ${expenseReports.total_expense}</div>
								<div className="font-size-28">Remainder ${expenseReports.reminder}</div>
							</div>
						</div>
						<div className="dashboard-right-bottom">
							<div className="dashboard-right-bottom-container">
								<div className="dashboard-right-title">Expenses</div>
								<PieChart data={expenseReports} />
							</div>
						</div>
					</div>
				</div>
			</Section>
		</Page>
	);
}
