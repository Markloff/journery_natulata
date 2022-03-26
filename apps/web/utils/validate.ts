


const isFullNameValid = (str: string) => str.length >= 3;
const isEmailValid = (str: string) => /\b[\w.-]+@[\w.-]+\.\w{2,4}\b/gi.test(str);


export {
	isFullNameValid,
	isEmailValid
}
