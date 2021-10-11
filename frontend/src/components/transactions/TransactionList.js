const TransactionList = (props) => {
	const { created_at, name, amount, type } = props.data.transaction;

	const getDate = (date) => {
		return new Date(date).toLocaleDateString("en-ZA", {
			month: "numeric",
			day: "numeric",
			year: "numeric",
		});
	};

	if (type === "income") {
		return (
			<tr onClick={props.data.onClick}>
				<td>{getDate(created_at)}</td>
				<td>{name}</td>
				<td className="income-amount">
					<span> + </span> ${amount}
				</td>
			</tr>
		);
	} else {
		return (
			<tr onClick={props.data.onClick}>
				<td>{getDate(created_at)}</td>
				<td>{name}</td>
				<td className="expense-amount">
					<span> - </span> ${amount}
				</td>
			</tr>
		);
	}
};
export default TransactionList;
