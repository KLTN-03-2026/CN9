import { Request, Response } from "express";
import authModel from "../models/authModel";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../types/express";
import userModel from "../models/userModel";

function createJWTAccount(accountId: number, username: string, role: string) {
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  const token = jwt.sign({ accountId, username, role }, JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
}

function createJWTUser(
  userId: number,
  username: string,
  avatar: string,
  points: number,
  email: string,
) {
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  const token = jwt.sign(
    { userId, username, avatar, points, email },
    JWT_SECRET,
    {
      expiresIn: "1h",
    },
  );
  return token;
}

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        message: "Email và mật khẩu là bắt buộc",
      });
    }

    const checkLogin = await authModel.loginUser({ email, password });

    if (!checkLogin.success) {
      return res.status(401).json(checkLogin.errors);
    }

    const token = createJWTUser(
      checkLogin.id,
      checkLogin.username,
      checkLogin.avatar ?? "",
      checkLogin.points,
      checkLogin.email,
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Đăng nhập thành công",
      data: checkLogin,
      type: "success",
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};

const loginAccount = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        message: "Email và mật khẩu là bắt buộc",
      });
    }

    const checkLogin = await authModel.loginAccount({ email, password });

    if (!checkLogin.success) {
      return res.status(401).json(checkLogin);
    }

    const token = createJWTAccount(
      checkLogin.id,
      checkLogin.username,
      checkLogin.role,
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Đăng nhập thành công",
      data: checkLogin,
      type: "success",
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};

const logout = (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });

  return res
    .status(200)
    .json({ message: "Đăng xuất thành công", type: "success" });
};

const getInfoAccount = async (req: Request, res: Response) => {
  try {
    const account = (req as AuthenticatedRequest).account!;

    res.status(200).json({
      message: "Lấy thông tin thành công",
      data: account,
      type: "success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", type: "error" });
  }
};

const getInfoUser = async (req: Request, res: Response) => {
  try {
    const user = (req as AuthenticatedRequest).user!;

    res.status(200).json({
      message: "Lấy thông tin thành công",
      data: user,
      type: "success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", type: "error" });
  }
};

const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;

    if (!token || typeof token !== "string") {
      return res
        .status(400)
        .json({ message: "Token không hợp lệ", type: "error" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as jwt.JwtPayload;

    const user = await userModel.getUserById(decoded.userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy người dùng", type: "error" });
    }

    if (user.is_verifyEmail) {
      return res
        .status(400)
        .json({ message: "Email đã được xác minh trước đó", type: "error" });
    }

    await userModel.verifyUserEmail(decoded.userId);

    return res
      .status(200)
      .json({ message: "Xác minh email thành công", type: "success" });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res
        .status(400)
        .json({ message: "Link xác minh đã hết hạn", type: "error" });
    }
    return res
      .status(400)
      .json({ message: "Token không hợp lệ", type: "error" });
  }
};

const googleCallback = (req: Request, res: Response) => {
  try {
    const user = (req as AuthenticatedRequest).user!;

    if (!user) {
      return res.redirect(
        `${process.env.CLIENT_URL}/login?error=google_failed`,
      );
    }

    const token = createJWTUser(
      user.id,
      user.name,
      user.avatar ?? "",
      user.points,
      user.email,
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 60 * 1000,
    });

    // Redirect về frontend kèm thông tin user qua query string
    const params = new URLSearchParams({
      id: String(user.id),
      username: user.name,
      avatar: user.avatar ?? "",
      points: String(user.points),
      email: user.email,
    });

    return res.redirect(
      `${process.env.CLIENT_URL}/login/callback?${params.toString()}`,
    );
  } catch (error) {
    console.error("Google callback error:", error);
    return res.redirect(`${process.env.CLIENT_URL}/login?error=server_error`);
  }
};

const googleRegisterCallback = (req: Request, res: Response) => {
  try {
    const user = (req as AuthenticatedRequest).user!;

    if (!user) {
      return res.redirect(
        `${process.env.CLIENT_URL}/register?error=google_failed`,
      );
    }

    const token = createJWTUser(
      user.id,
      user.name,
      user.avatar ?? "",
      user.points,
      user.email,
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 60 * 1000,
    });

    // Redirect về frontend register success page kèm thông tin user qua query string
    const params = new URLSearchParams({
      id: String(user.id),
      username: user.name,
      avatar: user.avatar ?? "",
      points: String(user.points),
      email: user.email,
      message: "register_success",
    });

    return res.redirect(
      `${process.env.CLIENT_URL}/register/success?${params.toString()}`,
    );
  } catch (error) {
    console.error("Google register callback error:", error);
    return res.redirect(`${process.env.CLIENT_URL}/register?error=server_error`);
  }
};

const googleAdminCallback = async (req: Request, res: Response) => {
  try {
    const user = (req as AuthenticatedRequest).user!;

    if (!user) {
      return res.redirect(
        `${process.env.CLIENT_URL}/login?error=google_failed`,
      );
    }

    // Check if user has admin role or permission
    // For now, we'll allow any Google user to login as admin
    // In production, you should check against Account table with admin roles
    const token = createJWTAccount(
      user.id,
      user.name,
      "admin", // Default role for Google admin login
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 60 * 1000,
    });

    // Redirect about admin frontend kèm thông tin account qua query string
    const params = new URLSearchParams({
      id: String(user.id),
      username: user.name,
      role: "admin",
      email: user.email,
    });

    return res.redirect(
      `${process.env.ADMIN_CLIENT_URL || process.env.CLIENT_URL}/login/admin/callback?${params.toString()}`,
    );
  } catch (error) {
    console.error("Google admin callback error:", error);
    return res.redirect(
      `${process.env.ADMIN_CLIENT_URL || process.env.CLIENT_URL}/login?error=server_error`,
    );
  }
};

const authController = {
  logout,
  loginUser,
  verifyEmail,
  getInfoUser,
  loginAccount,
  getInfoAccount,
  googleCallback,
  googleRegisterCallback,
  googleAdminCallback,
};

export default authController;
