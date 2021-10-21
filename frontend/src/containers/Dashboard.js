import React, { useEffect } from 'react';
import { Page, Section } from 'react-page-layout';
import { useDispatch, useSelector } from 'react-redux';

import PieChart from '../components/dashboard/PieChart';
import Breadcrumbs from '../components/default/SecondNavBar';
import { fetchExpenseReport, fetchLast4MonthsReport } from '../reducks/transactions/operations';
import { getExpenseReport, getLast4MonthsReport } from '../reducks/transactions/selectors';

export default function Report() {

	const dispatch = useDispatch();
	const selector = useSelector((state) => state);
	const expenseReports = getExpenseReport(selector);
	const last4MonthsReport = getLast4MonthsReport(selector);

	useEffect(() => {
		dispatch(fetchExpenseReport());
		dispatch(fetchLast4MonthsReport());
		// eslint-disable-next-line
	}, []);

	const largestReportAmount = Math.max.apply(
		Math,
		[{ total_amount: 0 }].concat(...last4MonthsReport).map((obj) => {
			return obj.total_amount;
		})
	);

	const chartGapAmount = Math.ceil((largestReportAmount * 1.3) / 7 / 100) * 100;
	const highestGraphAmount = chartGapAmount * 7;
	const chartHeight = 600;

	const formatTotalAmount = (amount) => {
		if (amount >= 1000000) {
			return (amount / 1000000).toFixed(1) + 'M';
		}
		if (amount >= 1000) {
			return (amount / 1000).toFixed(1) + 'K';
		}
		return amount;
	}

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
								<div className="p-2">Income and Expenses</div>
								<div className="pl-2">Last 4 Months Reports</div>
								<div>
									<span className="label-bar expense-amount">Expenditure</span>
									<span className="label-bar income-amount">Income</span>
								</div>
								<div className="bottom-line"></div>
								<table id="q-graph">
									<tbody>
										{last4MonthsReport.map((report, index) => {
											let income = report.find((i) => {
												return i.type === "income";
											});
											let expense = report.find((i) => {
												return i.type === "expense";
											});
											return (
												<tr className="qtr" id={`q${index + 1}`} key={`graph-${index}`}>
													<th scope="row">{report[0].date}</th>
													<td
														className="tooltip expense-bar bar"
														style={{
															height:
																((expense ? expense.total_amount : 0) * chartHeight) /
																highestGraphAmount,
														}}
													>
														<span className="tooltiptext">{`$${expense ? formatTotalAmount(expense.total_amount) : 0}`}</span>
													</td>
													<td
														className="tooltip income-bar bar"
														style={{
															height:
																((income ? income.total_amount : 0) * chartHeight) /
																highestGraphAmount,
														}}
													>
														<span className="tooltiptext">{`$${income ? formatTotalAmount(income.total_amount) : 0}`}</span>
													</td>
												</tr>
											)
										})}
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
