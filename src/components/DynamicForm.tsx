import React from "react";
import "../styles/DynamicForm.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

class DynamicForm extends React.Component<any, any> {
	constructor(props: any) {
		super(props);

		this.state = {
			options: [],
			question: "",
			newOption: "",
			questions: [],
			isSaved: false,
			ansFormat: "checkbox",
		};

		this.saveForm = this.saveForm.bind(this);
		this.addOption = this.addOption.bind(this);
		this.resetForm = this.resetForm.bind(this);
		this.resetState = this.resetState.bind(this);
		this.submitForm = this.submitForm.bind(this);
		this.addQuestion = this.addQuestion.bind(this);
		this.updateOption = this.updateOption.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.removeQuestion = this.removeQuestion.bind(this);
		this.handleCheckboxSelect = this.handleCheckboxSelect.bind(this);
		this.handleDropdownSelect = this.handleDropdownSelect.bind(this);
	}

	addOption() {
		let options = this.state.options;
		this.state.newOption
			? options.push(this.state.newOption)
			: options.push(`Option ${this.state.options.length + 1}`);
		this.setState({ options: options });
		this.setState({ newOption: "" });
	}

	updateOption(event: { target: { id: string | number; value: string } }) {
		let options = this.state.options;
		options[event.target.id] = event.target.value;
		this.setState({ options: options });
	}

	addQuestion() {
		if (
			this.state.question === "" ||
			(this.state.options.length === 0 && this.state.newOption === "")
		) {
			return;
		}

		if (this.state.newOption) {
			let options = this.state.options;
			options.push(this.state.newOption);
			this.setState({ options: options });
		}

		let newQuestion = {
			question: this.state.question,
			format: this.state.ansFormat,
			options: this.state.options,
			selectedOption: [],
		};

		let questions = this.state.questions;
		questions.push(newQuestion);
		this.setState({ questions: questions });
		this.resetState();
	}

	removeQuestion(index: number) {
		let questions = this.state.questions;
		questions.splice(index, 1);
		this.setState({ questions: questions });
	}

	resetState() {
		this.setState({
			question: "",
			ansFormat: "checkbox",
			newOption: "",
			options: [],
		});
	}

	saveForm() {
		this.setState({ isSaved: true });
		console.log("Saved form: ", this.state.questions);
	}

	resetForm() {
		this.setState({ isSaved: false });
	}

	submitForm() {
		let formData = this.state.questions.map(
			(qstn: {
				format: string;
				question: any;
				selectedOption: any[];
				options: { [x: string]: any };
			}) => {
				if (qstn.format === "dropdown") {
					return {
						question: qstn.question,
						selectedOption: qstn.selectedOption[0],
					};
				} else {
					return {
						question: qstn.question,
						selectedOption: qstn.selectedOption.map(
							(id: string | number) => {
								return qstn.options[id];
							}
						),
					};
				}
			}
		);

		console.log("Submitted form: ", formData);
	}

	handleChange(event: { target: { id: string; value: string } }) {
		this.setState({ [event.target.id]: event.target.value });
	}

	handleCheckboxSelect(event: { target: { id: string; value: string } }) {
		let questions = this.state.questions;
		let selectedOption = questions[event.target.id].selectedOption;
		let index = selectedOption.indexOf(event.target.value);
		if (index > -1) selectedOption.splice(index, 1);
		else selectedOption.push(event.target.value);
		questions[event.target.id].selectedOption = selectedOption;
		this.setState({ questions: questions });
	}

	handleDropdownSelect(event: { target: { id: string; value: string } }) {
		let questions = this.state.questions;
		let selectedOption = questions[event.target.id].selectedOption;
		if (selectedOption.length > 0) selectedOption.pop();
		selectedOption.push(event.target.value);
		questions[event.target.id].selectedOption = selectedOption;
		this.setState({ questions: questions });
	}

	render(): React.ReactNode {
		return (
			<>
				{this.state.questions.length > 0 ? (
					<div className="d-flex flex-column align-items-center">
						{this.state.questions.map((qstn: any, i: number) => {
							return (
								<div
									key={`qstn${i}`}
									className="displayQuestions container d-flex flex-column shadow p-3 mb-4"
								>
									<div className="d-flex justify-content-between">
										<p>
											{i + 1}. {qstn.question}
										</p>
										{this.state.isSaved ? null : (
											<FontAwesomeIcon
												icon={faTrash}
												onClick={() => {
													this.removeQuestion(i);
												}}
											/>
										)}
									</div>

									{qstn.format === "dropdown" ? (
										<select
											id={`${i}`}
											className="displayOptions"
											disabled={!this.state.isSaved}
											onChange={this.handleDropdownSelect}
										>
											{qstn.options.map(
												(option: string, j: number) => {
													return (
														<option
															value={option}
															key={`opt${i}${j}`}
														>
															{option}
														</option>
													);
												}
											)}
										</select>
									) : (
										qstn.options.map(
											(option: string, k: number) => {
												return (
													<div key={`opt${i}${k}`}>
														<input
															id={`${i}`}
															type="checkbox"
															value={`${k}`}
															disabled={
																!this.state
																	.isSaved
															}
															onChange={
																this
																	.handleCheckboxSelect
															}
														/>
														<label
															className="optionLabel"
															htmlFor={`${
																option + k
															}`}
														>
															{option}
														</label>
													</div>
												);
											}
										)
									)}
								</div>
							);
						})}
						{this.state.isSaved ? (
							<div className="d-flex">
								<button
									className="submitForm mb-5 me-5"
									onClick={this.submitForm}
								>
									Submit
								</button>
								<button
									className="submitForm mb-5"
									onClick={this.resetForm}
								>
									Back
								</button>
							</div>
						) : (
							<button
								className="saveForm mb-5"
								onClick={this.saveForm}
							>
								Save form
							</button>
						)}
					</div>
				) : null}

				{this.state.isSaved ? null : (
					<div className="inputForm container shadow p-3">
						<div className="formContainer d-flex flex-column justify-content-center align-items-center">
							<div className="qstnType d-flex justify-content-between">
								<input
									type="text"
									placeholder="Untitled question"
									id="question"
									value={this.state.question}
									onChange={this.handleChange}
								/>
								<select
									id="ansFormat"
									value={this.state.ansFormat}
									onChange={this.handleChange}
								>
									<option value="checkbox">Checkbox</option>
									<option value="dropdown">Dropdown</option>
								</select>
							</div>

							<div className="options d-flex flex-column mt-2">
								{this.state.options.length > 0
									? this.state.options.map(
											(option: any, i: any) => {
												return (
													<input
														className="my-2"
														type="text"
														id={`${i}`}
														key={`opt${i}`}
														value={`${option}`}
														placeholder={`Option ${
															i + 1
														}`}
														onChange={
															this.updateOption
														}
													/>
												);
											}
									  )
									: null}
							</div>

							<div className="newOption">
								<input
									className="my-2"
									type="text"
									id="newOption"
									value={this.state.newOption}
									placeholder={`Option ${
										this.state.options.length + 1
									}`}
									onChange={this.handleChange}
								/>
							</div>

							<div className="actions">
								<button
									className="addOption"
									onClick={this.addOption}
								>
									Add option
								</button>
								<button
									className="saveQstn ms-5"
									onClick={this.addQuestion}
								>
									Add question
								</button>
							</div>

							<div className="note mt-3">
								** Note: Fill the question field and at least
								one option to be able to add a question.
							</div>
						</div>
					</div>
				)}
			</>
		);
	}
}

export default DynamicForm;
