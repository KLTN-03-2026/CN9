import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import prisma from "../PrismaClient";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const avatar = profile.photos?.[0]?.value ?? "";
        const name = profile.displayName;
        const googleId = profile.id;

        if (!email) {
          return done(new Error("Không lấy được email từ Google"), undefined);
        }

        // Tìm user theo googleId trước
        let user = await prisma.user.findUnique({ where: { googleId } });

        if (!user) {
          // Tìm theo email (user đã đăng ký bằng email/password)
          user = await prisma.user.findUnique({ where: { email } });

          if (user) {
            // Liên kết googleId vào tài khoản cũ
            user = await prisma.user.update({
              where: { id: user.id },
              data: { googleId, avatar: user.avatar || avatar },
            });
          } else {
            // Tạo tài khoản mới qua Google
            user = await prisma.user.create({
              data: {
                name,
                email,
                googleId,
                avatar,
                password: "",
                is_verifyEmail: true, // Google đã xác thực email
              },
            });
          }
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error, undefined);
      }
    },
  ),
);

export default passport;
