import React from "react";
import {
  findByTestId,
  getAllByRole,
  getByRole,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ContactForm from "./ContactForm";

const renders = () => render(<ContactForm />);

test("renders without errors", () => {
  // Arrange:
  renders();

  // Act:
  // Assert:
  expect(screen.queryByTestId(/error/i)).toBeFalsy();
});

test("renders the contact form header", () => {
  // Arrange:
  renders();

  // Act:
  expect(screen.getByText(/contact form/i));

  // Assert: asserted by get
});

test("renders ONE error message if user enters less then 4 characters into firstname.", async () => {
  // Arrange:
  renders();
  const fNameInput = screen.getByLabelText(/first name/i);

  // Act:
  userEvent.type(fNameInput, "nam");

  // Assert: .get fails if there's > 1 result
  expect(screen.getByTestId(/error/i)).toBeInTheDocument();
});

test("renders THREE error messages if user enters no values into any fields.", async () => {
  // Arrange:
  renders();
  const fNameInput = screen.getByLabelText(/first name/i);
  const lNameInput = screen.getByLabelText(/last name/i);
  const emailInput = screen.getByLabelText(/email/i);

  // Act:
  userEvent.type(fNameInput, "nonsense");
  userEvent.clear(fNameInput);

  userEvent.type(lNameInput, "nonsense");
  userEvent.clear(lNameInput);

  userEvent.type(emailInput, "nonsense");
  userEvent.clear(emailInput);

  // Assert:
  expect(screen.getAllByTestId(/error/i).length).toEqual(3);
});

test("renders ONE error message if user enters a valid first name and last name but no email.", async () => {
  // Arrange:
  renders();
  const fNameInput = screen.getByLabelText(/first name/i);
  const lNameInput = screen.getByLabelText(/last name/i);
  const emailInput = screen.getByLabelText(/email/i);

  // Act:
  userEvent.type(fNameInput, "Eddward");

  userEvent.type(lNameInput, "Burke");

  userEvent.type(emailInput, "nonsense");
  userEvent.clear(emailInput);

  // Assert:
  expect(screen.getByTestId(/error/i)).toBeInTheDocument();
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
  // Arrange:
  renders();
  const emailInput = screen.getByLabelText(/email/i);

  // Act:
  userEvent.type(emailInput, "nonsense");

  // Assert:
  expect(screen.getByTestId(/error/i)).toHaveTextContent(
    /email must be a valid email address/i
  );
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
  // Arrange:
  renders();

  // Act:
  userEvent.click(screen.getByRole("button"));

  // Assert:
  expect(screen.getByText(/lastName is a required field/i));
});

test("renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.", async () => {
  // Arrange:
  renders();

  // Inputs
  const fName = "Eddward";
  const lName = "Burke";
  const email = "a@a.a";

  // Screen Elements
  const fNameInput = screen.getByLabelText(/first name/i);
  const lNameInput = screen.getByLabelText(/last name/i);
  const emailInput = screen.getByLabelText(/email/i);
  const button = screen.getByRole("button");

  // Act:
  userEvent.type(fNameInput, fName);
  userEvent.type(lNameInput, lName);
  userEvent.type(emailInput, email);
  userEvent.click(button);

  // Assert:
  expect(screen.getByTestId("firstnameDisplay").textContent).toContain(fName);
  expect(screen.getByTestId("lastnameDisplay").textContent).toContain(lName);
  expect(screen.getByTestId("emailDisplay").textContent).toContain(email);
  expect(screen.queryByTestId("messageDisplay")).toBeFalsy();
});

test("renders all fields text when all fields are submitted.", async () => {
  // Arrange:
  renders();
  // Inputs
  const fName = "Eddward";
  const lName = "Burke";
  const email = "a@a.a";
  const message = "Yes, yes.";

  // Screen Elements
  const fNameInput = screen.getByLabelText(/first name/i);
  const lNameInput = screen.getByLabelText(/last name/i);
  const emailInput = screen.getByLabelText(/email/i);
  const messageInput = screen.getByLabelText(/message/i);
  const button = screen.getByRole("button");

  // Act:
  userEvent.type(fNameInput, fName);
  userEvent.type(lNameInput, lName);
  userEvent.type(emailInput, email);
  userEvent.type(messageInput, message);
  userEvent.click(button);

  // Assert:
  expect(screen.getByTestId("firstnameDisplay").textContent).toContain(fName);
  expect(screen.getByTestId("lastnameDisplay").textContent).toContain(lName);
  expect(screen.getByTestId("emailDisplay").textContent).toContain(email);
  expect(screen.getByTestId("messageDisplay").textContent).toContain(message);
});
