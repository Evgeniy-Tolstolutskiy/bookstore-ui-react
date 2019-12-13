import {authenticationService} from "./authenticationService";
import history from "./history";

export function logout(context) {
    authenticationService.logout();
    history.push('/login');
    context.setState({
        currentUser: null,
        tokenPayload: ''
    });
}
