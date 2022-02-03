import {
    REPOS_SEARCH_REQUEST,
    REPOS_SEARCH_SUCCESS,
    REPOS_SEARCH_EMPTY,
    REPOS_SEARCH_NOT_FOUND,
    REPOS_CLEAR
} from "../actions/types";
import { addHistoryItem } from "./history";
import axios from "axios";

export const searchRepos = input => async (dispatch, getState) => {
    const { repos: { user: userState, error: errorState } } = getState();
    if (userState || errorState) {
        dispatch({ type: REPOS_CLEAR });
    }

    if (input !== "") {
        dispatch({ type: REPOS_SEARCH_REQUEST });

        try {
            const reposReq = axios.get(`https://api.github.com/users/${input}/repos?per_page=100&sort=updated`);
            const profileReq = axios.get(`https://api.github.com/search/users?q=${input}`);

            const [reposRes, profileRes] = await axios.all([reposReq, profileReq]);
            // const [profileRes] = await axios.all([profileReq]);

            // var totalRepos = []
            // var repos = []
            // for (var i=1; i<=10; i++) {
            //     var reposReq = axios.get(`https://api.github.com/users/${input}/repos?page=${i}per_page=100`);
            //     var [reposRes] = await axios.all([reposReq]);
            //     repos = reposRes.data;
            //     if (repos.length < 2) {break}
            //     console.log(repos)
            //     for (var j=0; j<repos.length; j++) {
            //         console.log(repos[j])
            //         totalRepos.push(repos[j])
            //     }
            // }

            // const key = 'name';
            // totalRepos = [...new Map(totalRepos.map(item =>
            //     [item[key], item])).values()];
            

            const matchingProfile = profileRes.data.items.find(item =>
                item.login.toLowerCase() === input.toLowerCase()
            );

            if (!matchingProfile) {
                dispatch({ type: REPOS_SEARCH_NOT_FOUND });
            }
            else {
                const user = {
                    name: matchingProfile.login,
                    avatar: matchingProfile.avatar_url
                };
                
                var repos = reposRes.data;

                repos = repos.filter(x => x.fork === false)

                repos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

                if (repos.length > 0) {
                    dispatch({
                        type: REPOS_SEARCH_SUCCESS,
                        payload: { user, repos }
                    });
                }
                else {
                    dispatch({
                        type: REPOS_SEARCH_EMPTY,
                        payload: { user }
                    });
                }

                dispatch(addHistoryItem(user.name));
            }
        }
        catch {
            dispatch({ type: REPOS_SEARCH_NOT_FOUND });
        }
    }
}