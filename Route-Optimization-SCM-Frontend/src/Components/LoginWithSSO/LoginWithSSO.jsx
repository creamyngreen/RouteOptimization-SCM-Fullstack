import { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { doLogin } from "../../redux/action/accountAction";
const LoginWithSSO = () => {
  const [searchParams] = useSearchParams();
  const runFirstRef = useRef(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.account);

  useEffect(() => {
    const ssoToken = searchParams.get("ssoToken");
    if (ssoToken && !runFirstRef.current) {
      runFirstRef.current = true;
      sessionStorage.removeItem("lastPath");
      dispatch(doLogin(ssoToken));
    }
  }, [dispatch, searchParams]);

  useEffect(() => {
    if (userInfo && userInfo.access_token) {
      const role = userInfo.roleWithPermission?.name;
      switch (role) {
        case "admin":
          navigate("/admin", { replace: true });
          break;
        case "planner":
          navigate("/planner", { replace: true });
          break;
        case "manager":
          navigate("/manager", { replace: true });
          break;
        default:
          navigate("/", { replace: true });
      }
    }
  }, [userInfo, navigate]);

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 mt-3">
          <h3>
            <span>
              Please login again. Click here to{" "}
              <a
                href={`${import.meta.env.VITE_BACKEND_SSO}?serviceURL=${
                  import.meta.env.VITE_SERVICE_URL
                }`}
              >
                login
              </a>
            </span>
          </h3>
        </div>
      </div>
    </div>
  );
};

export default LoginWithSSO;
