import axios from "axios";
import { AppToaster } from "../../components/Toaster";

const initialState = {
  isLogged: false,
  token: null,
};

const LOGIN_ACTION = "LOGIN_ACTION";
const GET_ALL_ACTION = "GET_ALL_ACTION"
const LOGOUT_ACTION = "LOGOUT_ACTION";
const REGISTER_ACTION = "REGISTER_ACTION";
const SET_TOKEN_ACTION = "SET_TOKEN_ACTION";
const ASK_RESET_PASSWORD_ACTION = "ASK_RESET_PASSWORD_ACTION";
const RESET_PASSWORD_ACTION = "RESET_PASSWORD_ACTION";
const CHANGE_PASSWORD_ACTION = "CHANGE_PASSWORD_ACTION";
const DELETE_USER_ACTION = "DELETE_USER_ACTION";
const GET_USER_INFO = "GET_USER_INFO";
const UPDATE_USER_SKILL = "UPDATE_USER_SKILL";
const UPDATE_USER_INFO = "UPDATE_USER_INFO";

const SHARE_SECRET_ACTION = "SHARE_SECRET_ACTION";
const BLOCK_USER_ACTION = "BLOCK_USER_ACTION";
const UNBLOCK_USER_ACTION = "UNBLOCK_USER_ACTION";
const FOLLOW_ACTION = "FOLLOW_ACTION";
const ASK_SECRET = "ASK_SECRET";
const GET_FOLLOWER_REQUEST_ACTION = "GET_FOLLOWER_REQUEST_ACTION";
const GET_FOLLOWERS_ACTION = "GET_FOLLOWERS";
const GET_FOLLOWED_ACTION = "GET_FOLLOWED";
const GET_ALL_BLOCKED = "GET_ALL_BLOCKED";




export const ShareSecret = (targetPseudo) => {
  const token = localStorage.getItem("token");
  const request = axios({
    method: "POST",
    url: `http://localhost:8000/share_secret/`,
    headers: {
      Authorization: `Token ${token}`,
    },
    data: { "pseudo": targetPseudo }
  });
  return {
    type: SHARE_SECRET_ACTION,
    payload: request
  }
}

export const unblockRequest = (targetPseudo) => {
  const token = localStorage.getItem("token");
  const request = axios({
    method: "DELETE",
    url: `http://localhost:8000/unblock_user/`,
    headers: {
      Authorization: `Token ${token}`,
    },
    data: { "pseudo": targetPseudo }
  });
  return {
    type: UNBLOCK_USER_ACTION,
    payload: request
  }
}

export const blockRequest = (targetPseudo) => {
  const token = localStorage.getItem("token");
  const request = axios({
    method: "POST",
    url: `http://localhost:8000/block_user/`,
    headers: {
      Authorization: `Token ${token}`,
    },
    data: { "pseudo": targetPseudo }
  });
  return {
    type: BLOCK_USER_ACTION,
    payload: request
  }
}

export const deleteUser = () => {
  const token = localStorage.getItem("token");
  const request = axios({
    method: "DELETE",
    url: `http://localhost:8000/user/`,
    headers: {
      Authorization: `Token ${token}`,
    },
  });

  return {
    type: DELETE_USER_ACTION,
    payload: request
  }
}

/////////////// get blocked users
export const GetBlocked = () => {
  const token = localStorage.getItem("token");
  const request = axios({
    method: "get",
    url: `http://localhost:8000/blocked_users/`,
    headers: {
      Authorization: `Token ${token}`,
    }
  });
  return {
    type: GET_ALL_BLOCKED,
    payload: request,
  };
}


//////////////test list users
export const GetListUsers = () => {
  const token = localStorage.getItem("token");
  const request = axios({
    method: "get",
    url: `http://localhost:8000/users/`,
    headers: {
      Authorization: `Token ${token}`,
    }
  });
  return {
    type: GET_ALL_ACTION,
    payload: request,
  };
}


/////////////// get user following

export const GetFollowerRequests = () => {
  const token = localStorage.getItem("token");
  const request = axios({
    method: "GET",
    url: `http://localhost:8000/get_follower_requests/`,
    headers: {
      Authorization: `Token ${token}`,
    }
  });

  return {
    type: GET_FOLLOWER_REQUEST_ACTION,
    payload: request,
  };
}

/////////////// get followed user
export const GetFollowed = () => {
  const token = localStorage.getItem("token");
  const request = axios({
    method: "GET",
    url: `http://localhost:8000/get_followed/`,
    headers: {
      Authorization: `Token ${token}`,
    }
  });

  return {
    type: GET_FOLLOWED_ACTION,
    payload: request,
  };
}


////////////////////     Show the followers of the user

export const GetFollowers = () => {
  const token = localStorage.getItem("token");
  const request = axios({
    method: "GET",
    url: `http://localhost:8000/get_followers/`,
    headers: {
      Authorization: `Token ${token}`,
    }
  });
  return {
    type: GET_FOLLOWERS_ACTION,
    payload: request,
  };
}

//Update user skill
export const update_user_skill = (skill) => {
  const token = localStorage.getItem("token");
  const request = axios({
    method: "PUT",
    url: `http://localhost:8000/change_skill_level/`,
    headers: {
      Authorization: `Token ${token}`,
    },
    data: { skill: skill }
  });

  return {
    type: UPDATE_USER_SKILL,
    payload: request,
  };
}

//Update user info
export const update_user_info = (visibility, description) => {
  const token = localStorage.getItem("token");
  if (description) {
    const request = axios({
      method: "PUT",
      url: `http://localhost:8000/update_user/`,
      headers: {
        Authorization: `Token ${token}`,
      },
      data: { visibility: visibility, description: description }
    });

    return {
      type: UPDATE_USER_INFO,
      payload: request,
    };
  }
  else {
    const request = axios({
      method: "PUT",
      url: `http://localhost:8000/update_user/`,
      headers: {
        Authorization: `Token ${token}`,
      },
      data: { visibility: visibility }
    });

    return {
      type: UPDATE_USER_INFO,
      payload: request,
    };
  }

}


export const PostAskSecret = (targetPseudo) => {
  console.log("CHARGE UTILE:", targetPseudo)
  const token = localStorage.getItem("token");
  const request = axios({
    method: "POST",
    url: `http://localhost:8000/ask_secret/`,
    headers: {
      Authorization: `Token ${token}`,
    },
    data: { "pseudo": targetPseudo }
  });
  return {
    type: ASK_SECRET,
    payload: request
  }
}

export const PostPublicFollow = (targetPseudo) => {
  const token = localStorage.getItem("token");
  const request = axios({
    method: "POST",
    url: `http://localhost:8000/follow/`,
    headers: {
      Authorization: `Token ${token}`,
    },
    data: { pseudo: targetPseudo },
  });

  return {
    type: FOLLOW_ACTION,
    payload: request,
  };
}

export const PostProtectedFollow = (targetSecret) => {
  const token = localStorage.getItem("token");
  const request = axios({
    method: "POST",
    url: `http://localhost:8000/follow/`,
    headers: {
      Authorization: `Token ${token}`,
    },
    data: { secret: targetSecret },
  });

  return {
    type: FOLLOW_ACTION,
    payload: request,
  };
}

export const askResetPassword = (email) => {
  const request = axios({
    method: "post",
    url: `http://localhost:8000/ask_reset_password/`,
    data: { email: email },
  });
  return {
    type: ASK_RESET_PASSWORD_ACTION,
    payload: request,
  }
}

export const resetPassword = (newPassword, uuid) => {
  const request = axios({
    method: "post",
    url: `http://localhost:8000/reset_password/uuid=${uuid}/`,
    data: { newPassword: newPassword },
  });
  return {
    type: RESET_PASSWORD_ACTION,
    payload: request,
  }
}

export const changePassword = (oldPassword, newPassword) => {
  const token = localStorage.getItem("token");
  const request = axios({
    method: "post",
    url: `http://localhost:8000/change_password/`,
    data: { oldPassword: oldPassword, newPassword: newPassword },
    headers: {
      Authorization: `Token ${token}`,
    },

  });
  return {
    type: CHANGE_PASSWORD_ACTION,
    payload: request,
  }
}


export const login = (email, password) => {
  const request = axios({
    method: "post",
    url: `http://localhost:8000/login/`,
    data: { username: email, password },
  });
  return {
    type: LOGIN_ACTION,
    payload: request,
  };
};

export const get_user_info = (token) => {
  const request = axios({
    method: "get",
    url: `http://localhost:8000/user/`,
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  return {
    type: GET_USER_INFO,
    payload: request,
  };
};


export const register = (email, password, pseudo, visibility, description, skill) => {
  const request = axios({
    method: "post",
    url: `http://localhost:8000/register/`,
    data: { email, password, pseudo, visibility, description, skill },
    // headers: {
    //   "Access-Control-Allow-Origin": "*",
    //   "Access-Control-Allow-Headers": ["x-requested-with", "content-type", "accept", "origin", "authorization", "x-csrftoken", "user-agent", "accept-encoding"],
    //   "Access-Control-Allow-Methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
    // }
  });
  return {
    type: REGISTER_ACTION,
    payload: request,
  };
};

export const logout = () => {
  const token = localStorage.getItem("token");
  const request = axios({
    method: "post",
    url: `http://localhost:8000/logout/`,
    headers: {
      Authorization: `Token ${token}`,
    },

  });
  window.location.reload();
  localStorage.clear();

  return {
    type: LOGOUT_ACTION,
    payload: request,
  };
};

export const setToken = (token) => {
  return {
    type: SET_TOKEN_ACTION,
    payload: token,
  };
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {



    case `${SHARE_SECRET_ACTION}_FULFILLED`:
      console.log("action.payload.data", action.payload.data)
    case `${SHARE_SECRET_ACTION}_PENDING`:
      return state;
    case `${SHARE_SECRET_ACTION}_REJECTED`:
      {
        let message = `${action.payload}`;
        AppToaster.show({ message: message, intent: "danger" });
      }
      return state;

    case `${UNBLOCK_USER_ACTION}_FULFILLED`:
      return {
        ...state,
        blockedUsers: state.blockedUsers.filter((item, index) => index !== action.payload),
      }
    case `${UNBLOCK_USER_ACTION}_PENDING`:
      return state;
    case `${UNBLOCK_USER_ACTION}_REJECTED`:
      {
        let message = `${action.payload}`;
        AppToaster.show({ message: message, intent: "danger" });
      }
      return state;


    case `${BLOCK_USER_ACTION}_FULFILLED`:
      state.blockedUsers = action.payload.data
      return {
        ...state,
        followed: state.followed.filter((item, index) => index !== action.payload),
        potentialFriends: state.potentialFriends.filter((item, index) => index !== action.payload),
      }
    case `${BLOCK_USER_ACTION}_PENDING`:
      return state;
    case `${BLOCK_USER_ACTION}_REJECTED`:
      {
        let message = `${action.payload}`;
        AppToaster.show({ message: message, intent: "danger" });
      }
      return state;

    case `${GET_ALL_BLOCKED}_FULFILLED`:
      state.blockedUsers = action.payload.data
      return state;
    case `${GET_ALL_BLOCKED}_PENDING`:
      return state;
    case `${GET_ALL_BLOCKED}_REJECTED`:
      {
        let message = `${action.payload}`;
        AppToaster.show({ message: message, intent: "danger" });
      }
      return state;

    case `${GET_FOLLOWER_REQUEST_ACTION}_FULFILLED`:
      state.potentialFriends = action.payload.data
      return state;
    case `${GET_FOLLOWER_REQUEST_ACTION}_PENDING`:
      return state;
    case `${GET_FOLLOWER_REQUEST_ACTION}_REJECTED`:
      {
        let message = `${action.payload}`;
        AppToaster.show({ message: message, intent: "danger" });
      }
      return state;

    case `${LOGIN_ACTION}_FULFILLED`:
      localStorage.setItem("token", action.payload.data.token);
      state.token = action.payload.data.token;
      state.isLogged = true;
      return state;
    case `${LOGIN_ACTION}_PENDING`:
      return state;
    case `${LOGIN_ACTION}_REJECTED`:
      {
        let message = `${action.payload}`;
        AppToaster.show({ message: message, intent: "danger" });
      }
      return state;

    case `${GET_USER_INFO}_FULFILLED`:
      localStorage.setItem("skill", action.payload.data.skill);
      state.skill = action.payload.data.skill;
      return state;
    case `${GET_USER_INFO}_PENDING`:
      return state;
    case `${GET_USER_INFO}_REJECTED`:
      {
        let message = `${action.payload}`;
        AppToaster.show({ message: message, intent: "danger" });
      }
      return state;

    case `${REGISTER_ACTION}_FULFILLED`:
      state.token = action.payload.data.token;
      state.isLogged = true;
      return state;
    case `${REGISTER_ACTION}_PENDING`:
      return state;
    case `${REGISTER_ACTION}_REJECTED`:
      {
        let message = `${action.payload}`;
        AppToaster.show({ message: message, intent: "danger" });
      }
      return state;
    case SET_TOKEN_ACTION:
      state.token = action.payload.token;
      state.isLogged = true;
      return state;
    case LOGOUT_ACTION:
      state.token = "";
      state.isLogged = false;
      return state;
    default:
      return state;
    ///////////////test get all users

    case `${GET_ALL_ACTION}_FULFILLED`:
      state.users = action.payload.data
      return state;

    case `${GET_ALL_ACTION}_PENDING`:
      return state;
    case `${GET_ALL_ACTION}_REJECTED`:
      {
        let message = `${action.payload}`;
        AppToaster.show({ message: message, intent: "danger" });
      }
      return state;

    ////////////get followers
    case `${GET_FOLLOWERS_ACTION}_FULFILLED`:
      state.followers = action.payload.data
      return state;

    case `${GET_FOLLOWERS_ACTION}_PENDING`:
      return state;
    case `${GET_FOLLOWERS_ACTION}_REJECTED`:
      {
        let message = `${action.payload}`;
        AppToaster.show({ message: message, intent: "danger" });
      }
      return state;

    ////////////get followers
    case `${GET_FOLLOWED_ACTION}_FULFILLED`:
      state.followed = action.payload.data
      return state;

    case `${GET_FOLLOWED_ACTION}_PENDING`:
      return state;
    case `${GET_FOLLOWED_ACTION}_REJECTED`:
      {
        let message = `${action.payload}`;
        AppToaster.show({ message: message, intent: "danger" });
      }
      return state;


    //////////POST follow
    case `${FOLLOW_ACTION}_FULFILLED`:
      state.followed = action.payload.data
      return state;

    case `${FOLLOW_ACTION}_PENDING`:
      return state;
    case `${FOLLOW_ACTION}_REJECTED`:
      {
        let message = `${action.payload}`;
        AppToaster.show({ message: message, intent: "danger" });
      }
      return state;


    case `${UPDATE_USER_SKILL}_FULFILLED`:
      return state;

    case `${UPDATE_USER_SKILL}_PENDING`:
      return state;
    case `${UPDATE_USER_SKILL}_REJECTED`:
      {
        let message = `${action.payload}`;
        AppToaster.show({ message: message, intent: "danger" });
      }
      return state;

    case `${UPDATE_USER_INFO}_FULFILLED`:
      return state;

    case `${UPDATE_USER_INFO}_PENDING`:
      return state;
    case `${UPDATE_USER_INFO}_REJECTED`:
      {
        let message = `${action.payload}`;
        AppToaster.show({ message: message, intent: "danger" });
      }
      return state;
  }
}
// export const getUsers = state => state.users;