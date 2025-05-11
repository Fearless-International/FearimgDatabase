import { useForm } from "react-hook-form";
import StarImg from "../../assets/images/v1/star2.png";
import Field from "../common/Field";
import axios from 'axios';
function ResetForm() {
	const {
	  register,
	  handleSubmit,
	  formState: { errors },
	  setError
	} = useForm();
  
	const submitForm = async (formData) => {
	  try {
		// Get token from URL query params
		const urlParams = new URLSearchParams(window.location.search);
		const token = urlParams.get('token');
  
		if (token) {
		  // Reset password
		  const response = await axios.post('http://localhost:1337/api/auth/reset-password', {
			token,
			password: formData.password
		  });
		  alert(response.data.message);
		} else {
		  // Request password reset
		  const response = await axios.post('http://localhost:1337/api/auth/forgot-password', {
			email: formData.email
		  });
		  alert(response.data.message);
		}
	  } catch (error) {
		if (error.response?.data?.error) {
		  setError('submit', {
			type: 'manual',
			message: error.response.data.error
		  });
		}
	  }
	};
	return (
		<div className="section aximo-section-padding">
			<div className="container">
				<div className="aximo-account-title">
					<h2>
						<span className="aximo-title-animation">
							Reset Password
							<span className="aximo-title-icon">
								<img src={StarImg} alt="star" />
							</span>
						</span>
					</h2>
				</div>
				<div className="aximo-account-wrap">
					<form onSubmit={handleSubmit(submitForm)}>
						<div className="aximo-account-field">
							<Field label="Enter email address" error={errors.email}>
								<input
									{...register("email", { required: "Email is required." })}
									type="email"
									name="email"
									id="email"
									placeholder="example@gmail.com"
								/>
							</Field>
						</div>
						<div className="aximo-account-field">
							<Field label="Enter Password" error={errors.password}>
								<input
									{...register("password", {
										required: "Password is required.",
										minLength: {
											value: 8,
											message: "Your password must be at least 8 characters.",
										},
									})}
									type="password"
									name="password"
									id="password"
									placeholder="Enter password"
								/>
							</Field>
						</div>
						<button id="aximo-account-btn" type="submit">
							Reset account
						</button>
						<div className="aximo-account-bottom m-0">
							<p>If you didn’t request a password recovery link, please ignore this.</p>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export default ResetForm;
