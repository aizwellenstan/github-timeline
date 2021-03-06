import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Paper from "@material-ui/core/Paper";
import Button from "./Button";
import { searchRepos } from "../actions/repos";

const Form = () => {
    const [username, setUsername] = useState("");
    const [focused, setFocused] = useState(false);
    const [error, setError] = useState(false);
    const shouldValidate = useRef(false);

    const dispatch = useDispatch();

    const changeHandler = ({ target: { value } }) => {
        setUsername(value);
        setError(value.trim() === "" && shouldValidate.current);
    }

    const submitHandler = event => {
        event.preventDefault();
        dispatch(searchRepos(username.trim()));

        shouldValidate.current = username.trim() === "";
        setError(username.trim() === "");
        setUsername("");
    }

    const { loading } = useSelector(state => state.repos);
    useEffect(() => {
        if (loading) {
            setError(false);
            shouldValidate.current = false;
        }

        setUsername("aizwellenstan");
    }, [loading])

    function useInterval(callback, delay) {
        const savedCallback = useRef();
      
        // Remember the latest callback.
        useEffect(() => {
          savedCallback.current = callback;
        }, [callback]);
      
        // Set up the interval.
        useEffect(() => {
          function tick() {
            savedCallback.current();
          }
          if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
          }
        }, [delay]);
      }
      
      function Request() {
        let [requestCount, setRequestCount] = useState(0);
      
        // Run every second
        const delay = 10000;
      
        useInterval(() => {
          // Make the request here
          setRequestCount(requestCount + 1);
        }, delay);
      
        console.log(requestCount)
        return requestCount;
      }

      Request()

    return (
        <Paper elevation={24} style={{
            color: "inherit",
            backgroundColor: "transparent"
        }}>
            <button onClick={submitHandler} id="btn"></button>
            <form className={!error ? "form" : "form form--error"} onSubmit={submitHandler}>
                <div className="form__content">
                    <div className={focused ? "form__input-wrapper focused" : "form__input-wrapper"}>
                        <input
                            className="form__input"
                            placeholder="Enter a username here..."
                            value={username}
                            onChange={changeHandler}
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                        />
                    </div>
                    <Button wide big wobble text="Generate" icon="fas fa-location-arrow" />
                </div>
            </form>
        </Paper>
    )
}

export default Form;