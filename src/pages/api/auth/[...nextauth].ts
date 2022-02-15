import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

import { fauna } from '../../../services/fauna';
import { query as q } from 'faunadb';

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      authorization: { params: { scope: 'read:user' } }
    }),
  ],
  callbacks: {
    async session({ session }) {

      try {

        const userActiveSubscription = await fauna.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index('subscription-by-user-ref'),
                q.Select(
                  "ref",
                  q.Get(
                    q.Match(
                      q.Index('user-email'),
                      q.Casefold(session.user.email)
                    )
                  )
                )
              ),
              q.Match(
                q.Index('subscription-by-status'),
                "active"
              )
            ])
          )
        )

        return {
          ...session,
          activeSubscription: userActiveSubscription
        };
      } catch {
        return {
          ...session,
          activeSubscription: null
        }
      }
    },
    async signIn({ user, account, profile, email, credentials }) {

      const userEmail = user.email;


      try {

        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(
                  q.Index('user-email'),
                  q.Casefold(userEmail)
                )
              )
            ),
            q.Create(
              q.Collection('users'),
              { data: { userEmail } }
            ),
            q.Get(
              q.Match(
                q.Index('user-email'),
                q.Casefold(userEmail)
              )
            )
          )
        )

        return true;
      } catch (error) {

        console.log(error)
        return false;
      }
    }
  }
})