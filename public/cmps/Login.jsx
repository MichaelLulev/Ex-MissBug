
import { userService } from '../services/user.service.js'

const { useState } = React

export function Login() {
    const [isLogin, setIsLogin] = useState(true)
    const [loggedInUser, setLoggedInUser] = useState(userService.getLoggedInUser())
    const [formUser, setFormUser] = useState(userService.getNewUser())

    function onChangeUser(ev) {
        const name = ev.target.name
        const value = ev.target.value
        setFormUser(prev => ({ ...prev, [name]: value }))
    }

    function onSubmitForm(ev) {
        ev.preventDefault()
        if (! isLogin) var formFunc = userService.signup
        else var formFunc = userService.login
        formFunc(formUser)
            .then(user => {
                setLoggedInUser(user)
                setFormUser(userService.getNewUser())
            })
            .catch(err => console.error(err))
    }

    function onLogout() {
        userService.logout()
            .then(() => {
                setIsLogin(true)
                setLoggedInUser(userService.getLoggedInUser())
                setFormUser(userService.getNewUser())
            })
    }
    
    return (
        <React.Fragment>
        {
            loggedInUser &&
            <section className="logged-in-user">
                <button className="logout" onClick={onLogout}>
                    Logout
                </button>
                <label>{loggedInUser.username}</label>
            </section>
        }
        {
            ! loggedInUser &&
            <section className="login">
            {
                ! isLogin &&
                <button className="login-button" onClick={() => setIsLogin(prev => ! prev)}>
                    Login
                </button>
            }
            {
                isLogin &&
                <button className="signup-button" onClick={() => setIsLogin(prev => ! prev)}>
                    Sign up
                </button>
            }
                <h3>{isLogin ? 'Login' : 'Sign up'}</h3>
                <form className="login-form" onSubmit={onSubmitForm}>
                {
                    ! isLogin &&
                    <label>
                        <span>Full name: </span>
                        <input
                            type="text"
                            name="fullName"
                            value={formUser.fullName}
                            onChange={onChangeUser}
                        />
                    </label>
                }
                    <label>
                        <span>Username: </span>
                        <input
                            type="text"
                            name="username"
                            value={formUser.username}
                            onChange={onChangeUser}
                        />
                    </label>
                    <label>
                        <span>Password: </span>
                        <input
                            type="password"
                            name="password"
                            value={formUser.password}
                            onChange={onChangeUser}
                        />
                    </label>
                    <button className="submit-button">
                        Submit
                    </button>
                </form>
            </section>
        }
        </React.Fragment>
    )
}