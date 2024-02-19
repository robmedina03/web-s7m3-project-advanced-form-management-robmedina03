// ❗ The ✨ TASKS inside this component are NOT IN ORDER.
// ❗ Check the README for the appropriate sequence to follow.
import React, { useEffect, useState } from 'react'
import axios from'axios'
import * as yup from 'yup'

const e = { // This is a dictionary of validation error messages.
  // username
  usernameRequired: 'username is required',
  usernameMin: 'username must be at least 3 characters',
  usernameMax: 'username cannot exceed 20 characters',
  // favLanguage
  favLanguageRequired: 'favLanguage is required',
  favLanguageOptions: 'favLanguage must be either javascript or rust',
  // favFood
  favFoodRequired: 'favFood is required',
  favFoodOptions: 'favFood must be either broccoli, spaghetti or pizza',
  // agreement
  agreementRequired: 'agreement is required',
  agreementOptions: 'agreement must be accepted',
}

// ✨ TASK: BUILD YOUR FORM SCHEMA HERE
// The schema should use the error messages contained in the object above.

const schema = yup.object().shape({
  username: yup.string().required(e.usernameRequired).min(3, e.usernameMin).max(20,e.usernameMax),
  favLanguage: yup.string().required(e.favLanguage).oneOf(['javascript', 'rust'], e.favLanguageOptions),
  favFood: yup.string().required(e.favFood).oneOf(['broccoli', 'spaguetti', 'pizza'], e.favFoodOptions),
  agreement: yup.string().oneOf([true], e.agreementOptions),


});



const getinitalValues = () =>({
  username: '',
  favLanguage: '',
  favFood: '',
  agreement: false,
})
  const getinitalErrors = () =>({
    username: '',
    favLanguage: '',
    favFood: '',
    agreement: '',

})
export default function App() {

  const [ values, setValues]= useState(getinitalValues());
  const [ errors, setErrors]= useState(getinitalErrors());
  const [serverSucess, setserverSuccess] = useState();
  const [serverFailure, setserverFailure] = useState();
  const [formEnabled, setformEnabled]= useState(false)
  // You will need states to track (1) the form, (2) the validation errors,
  // (3) whether submit is disabled, (4) the success message from the server,
  // and (5) the failure message from the server.


  useEffect(() => {

    schema
    .isValid(values)
    .then(setformEnabled)
    
  }, [values]);
  // ✨ TASK: BUILD YOUR EFFECT HERE
  // Whenever the state of the form changes, validate it against the schema
  // and update the state that tracks whether the form is submittable.

  const onChange = evt => {

    let {type,name,value,checked} = evt.target;
     value = type == 'checkbox'? checked : value

    setValues({...values, [name]: value});
    yup.reach(schema, name).validate(value)
    .then(()=> setErrors({...errors, [name]: ''}))
    .catch((err) => setErrors({...errors, [name]:err.errors[0]}))
    // ✨ TASK: IMPLEMENT YOUR INPUT CHANGE HANDLER
    // The logic is a bit different for the checkbox, but you can check
    // whether the type of event target is "checkbox" and act accordingly.
    // At every change, you should validate the updated value and send the validation
    // error to the state where we track frontend validation errors.
  }

  const onSubmit = async  evt => {

    evt.preventDefault();
    
          axios.post('https://webapis.bloomtechdev.com/registration', values)
         .then(res => {
          setValues(getinitalValues())
          setserverSuccess(res.data.message)
          setserverFailure()
         }) 
         .catch(err =>{
          setserverFailure(err.response.data.message)
          setserverSuccess()

         })
          


    
    
    // ✨ TASK: IMPLEMENT YOUR SUBMIT HANDLER
    // Lots to do here! Prevent default behavior, disable the form to avoid
    // double submits, and POST the form data to the endpoint. On success, reset
    // the form. You must put the success and failure messages from the server
    // in the states you have reserved for them, and the form
    // should be re-enabled.
  };

  return (
    <div> {/* TASK: COMPLETE THE JSX */}
      <h2>Create an Account</h2>
      <form onSubmit={onSubmit}>
    {serverSucess  &&<h4 className="success">{serverSucess}</h4>}
      {serverFailure &&  <h4 className="error"> {serverFailure}  </h4>}

        <div className="inputGroup">
          <label htmlFor="username">Username:</label>
          <input value={values.username} onChange={onChange} id="username" name="username" type="text" placeholder="Type Username" />
         {errors.username && <div className="validation"> {errors.username}  </div>}
        </div>

        <div className="inputGroup">
          <fieldset>
            <legend>Favorite Language:</legend>
            <label>
              <input checked={values.favLanguage == 'javascript'} onChange={onChange} type="radio" name="favLanguage" value="javascript" />
              JavaScript
            </label>
            <label>
              <input checked={values.favLanguage == 'rust'} onChange={onChange} type="radio" name="favLanguage" value="rust" />
              Rust
            </label>
          </fieldset>
       {errors.favLanguage &&   <div className="validation"> {errors.favLanguage}  </div>}
        </div>

        <div className="inputGroup">
          <label htmlFor="favFood">Favorite Food:</label>
          <select value={values.favFood} onChange={onChange} id="favFood" name="favFood">
            <option value="">-- Select Favorite Food --</option>
            <option value="pizza">Pizza</option>
            <option value="spaghetti">Spaghetti</option>
            <option value="broccoli">Broccoli</option>
          </select>
        {errors.favFood &&  <div className="validation"> {errors.favFood}  </div>}
        </div>

        <div className="inputGroup">
          <label>
            <input checked={values.agreement} onChange={onChange} id="agreement" type="checkbox" name="agreement" />
            Agree to our terms
          </label>
        {errors.agreement &&  <div className="validation"> {errors.agreement}</div>}
        </div>

        <div>
          <input disabled={!formEnabled} type="submit"  />
        </div>
      </form>
    </div>
  )
}
