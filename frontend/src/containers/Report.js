import React, { createRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

import Empty from "../components/default/Empty";
import Header from "../components/default/Header";
import Pagination from "../components/default/Pagination";
import TransactionList from "../components/transactions/TransactionList";
import {
	addTransaction,
	deleteTransaction,
	fetchReportTransactions,
	fetchTransactions,
	updateTransaction,
} from "../reducks/transactions/operations";
import { getTransactions } from "../reducks/transactions/selectors";
import AddIcon from "./../assets/images/add-icon.svg";
import TransactionIcon from "./../assets/images/transaction.svg";
import CancelModal from "./../assets/images/×.png";

export default function Report() {
	const history = useHistory();
	const dispatch = useDispatch();
	const selector = useSelector((state) => state);
	const transactions = getTransactions(selector);
	const reports = transactions.reports;

	useEffect(() => {
		dispatch(fetchTransactions({ page }));
		dispatch(fetchReportTransactions());
		// eslint-disable-next-line
	}, []);

	const largestReportAmount = Math.max.apply(
		Math,
		[{total_amount: 0}].concat(...reports).map((obj) => {
			return obj.total_amount;
		})
	);

	const chartGapAmount = Math.ceil((largestReportAmount * 1.3) / 7 / 100) * 100;
	const highestGraphAmount = chartGapAmount * 7;
	const chartHeight = 400;

	let tickElements = [];
	for (let i = 6; i >= 0; i--) {
		let element = (
			<div className="tick" key={`tick-${i}`}>
				<p>{chartGapAmount * i}</p>
			</div>
		);
		tickElements.push(element);
	}

	const reportRef = createRef();
	const chartRef = createRef();
	const modelRef = createRef();

	const [activeTab, setActiveTab] = useState("report");
	const [openModal, setOpenModal] = useState(false);
	const [openModalConfirmation, setOpenModalConfirmation] = useState(false);
	const [isUpdate, setIsUpdate] = useState(false);
	const page = 1;

	const initialValues = { id: null, type: "income", name: "", amount: 0 };
	const [values, setValues] = useState(initialValues);

	const handleInputChange = (e) => {
		const { name, value } = e.target;

		setValues({
			...values,
			[name]: value,
		});
	};

	const reportHandler = () => {
		reportRef.current.classList.add("content--active");
		chartRef.current.classList.remove("content--active");
		setActiveTab("report");
	};

	const chartHandler = () => {
		chartRef.current.classList.add("content--active");
		reportRef.current.classList.remove("content--active");
		setActiveTab("chart");
	};

	const addReportHandler = async () => {
		history.push('/')
		await dispatch(addTransaction(values));
		await dispatch(fetchTransactions({ page }));
		await dispatch(fetchReportTransactions());
		setValues({ type: "income", name: "", amount: 0 });
	};

	const updateReportHandler = async () => {
		history.push('/')
		await dispatch(updateTransaction(values, values.id));
		await dispatch(fetchTransactions({ page }));
		setIsUpdate(false);
		setOpenModal(false);
	};

	const deleteReportHandler = async () => {
		await dispatch(deleteTransaction(values.id));
		await dispatch(fetchTransactions({ page }));
		await dispatch(fetchReportTransactions());
		setIsUpdate(false);
		setOpenModal(false);
		setOpenModalConfirmation(false);
	};

	const openAddReportModalHandler = () => {
		setValues({ type: "income", name: "", amount: 0 });
		setOpenModal(true);
	};

	const closeAddReportModalHandler = () => {
		setIsUpdate(false);
		setOpenModal(false);
	};

	const detailReportHandle = (data) => {
		setIsUpdate(true);
		setOpenModal(true);
		setValues({ id: data.id, type: data.type, name: data.name, amount: data.amount });
	};

	return (
		<>
			<Header />
			<div ref={modelRef} id="custom-modal" className={`custom-modal ${openModal ? "" : "modal-hide"}`}>
				<div id="custom-modal-close" onClick={closeAddReportModalHandler} className="custom-modal--bg"></div>
				<div className="custom-modal--container">
					<div className="custom-modal--content">
						<div onClick={closeAddReportModalHandler} className="custom-modal--cancel">
							<img src={CancelModal} alt="cancel" />
						</div>
						<div className="modal-content">
							<form className="popup-form-container">
								<div className="budget-form">
									<select
										value={values.type}
										onChange={handleInputChange}
										name="type"
										className="budget-dropdown"
									>
										<option value="income">Income</option>
										<option value="expense">Expense</option>
									</select>
									<div className="budget-input">
										<input
											onChange={handleInputChange}
											value={values.name}
											name="name"
											className="custom-input-modal"
											type="text"
											placeholder="Type name"
										/>
										{transactions.errors.name ? (
											<span className="error-text">{transactions.errors.name[0]}</span>
										) : (
											""
										)}
										<input
											onChange={handleInputChange}
											value={values.amount}
											name="amount"
											className="custom-input-modal mt-2"
											type="number"
											min="1"
											placeholder="Type amount"
										/>
										{transactions.errors.amount ? (
											<span className="error-text">{transactions.errors.amount[0]}</span>
										) : (
											""
										)}
										{isUpdate ? (
											<div className="setting-button">
												<button
													onClick={updateReportHandler}
													type="button"
													className="custom-btn update"
												>
													Update
												</button>
												<button
													onClick={() => setOpenModalConfirmation(true)}
													type="button"
													className="custom-btn delete"
												>
													Delete
												</button>
											</div>
										) : (
											<button
												onClick={addReportHandler}
												type="button"
												className="custom-btn active"
											>
												Add
											</button>
										)}
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
			<div id="custom-modal" className={`custom-modal ${openModalConfirmation ? "" : "modal-hide"}`}>
				<div
					id="custom-modal-close"
					onClick={() => setOpenModalConfirmation(false)}
					className="custom-modal--bg"
				></div>
				<div className="custom-modal-transaction--container">
					<div className="custom-modal-transaction--content">
						<div className="modal-transaction-content">
							<strong>Are you sure you want to delete this transaction?</strong>
							<div>
								<button className="custom-btn mr-1" onClick={deleteReportHandler}>
									Yes
								</button>
								<button className="custom-btn ml-1" onClick={() => setOpenModalConfirmation(false)}>
									No
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="homepage">
				<div className="container">
					<div className="container-header">
						<ul className="container--tabs">
							<li onClick={reportHandler} className={activeTab === "report" ? "tab tabs--active" : "tab"}>
								Tables
							</li>
							<li
								onClick={chartHandler}
								className={activeTab === "chart" ? "tab2 tab tabs--active" : "tab2 tab"}
							>
								Report
							</li>
						</ul>
						<div onClick={openAddReportModalHandler} className="add-budget">
							<p>Add</p>
							<img src={AddIcon} alt="" />
						</div>
					</div>
					<div className="container--content">
						<div ref={reportRef} className="content container--report content--active">
							<div className="table-container">
								{transactions.results && transactions.results.length > 0 ? (
									<table>
										<thead>
											<tr>
												<th>Date</th>
												<th>Items</th>
												<th>Cost</th>
											</tr>
										</thead>
										<tbody>
											{transactions.results.map((t) => (
												<TransactionList
													key={t.id}
													data={{ transaction: t, onClick: () => detailReportHandle(t) }}
												/>
											))}
										</tbody>
									</table>
								) : (
									<Empty
										className={"no-transaction-container"}
										icon={TransactionIcon}
										message="No transactions here yet..."
									/>
								)}
							</div>
							{transactions.results && transactions.results.length > 0 ? (
								<div className="pagination">
									<Pagination
										metadata={{
											links: transactions.links,
											totalPages: transactions.total_pages,
											count: transactions.count,
											next: transactions.next,
											previous: transactions.previous,
											current: transactions.current,
										}}
									/>
								</div>
							) : (
								""
							)}
						</div>
						<div ref={chartRef} className="content container--chart">
							<div className="inner-container--chart">
								<p className="chart-title">Last 3 months report</p>
								<div>
									<span className="label-bar expense-amount">Expenditure</span>
									<span className="label-bar income-amount">Income</span>
								</div>
								<p className="currency-label">($)</p>
								<table id="q-graph">
									<tbody>
										{reports.map((item, index) => {
											let income = item.find((i) => {
												return i.type === "income";
											});
											let expense = item.find((i) => {
												return i.type === "expense";
											});
											return (
												<tr className="qtr" id={`q${index + 1}`} key={`graph-${index}`}>
													<th scope="row">{item[0].created_at}</th>
													<td
														className="tooltip expense-bar bar"
														style={{
															height:
																((expense ? expense.total_amount : 0) * chartHeight) /
																highestGraphAmount,
														}}
													>
														<span className="tooltiptext">{`$${
															expense ? expense.total_amount : 0
														}`}</span>
													</td>
													<td
														className="tooltip income-bar bar"
														style={{
															height:
																((income ? income.total_amount : 0) * chartHeight) /
																highestGraphAmount,
														}}
													>
														<span className="tooltiptext">{`$${
															income ? income.total_amount : 0
														}`}</span>
													</td>
												</tr>
											);
										})}
										<tr className="qtr" id="q4">
											<th scope="row">(Month)</th>
										</tr>
									</tbody>
								</table>
								<div id="ticks">{tickElements.map((value) => value)}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
