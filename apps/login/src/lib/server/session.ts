"use server";

import {
  deleteSession,
  getSession,
  getUserByID,
  listAuthenticationMethodTypes,
} from "@/lib/zitadel";
import {
  createSessionAndUpdateCookie,
  createSessionForIdpAndUpdateCookie,
  setSessionAndUpdateCookie,
} from "@/utils/session";
import { headers } from "next/headers";
import { Checks } from "@zitadel/proto/zitadel/session/v2/session_service_pb";
import {
  RequestChallenges,
  RequestChallengesSchema,
} from "@zitadel/proto/zitadel/session/v2/challenge_pb";
import { create } from "@zitadel/client";
import {
  getMostRecentSessionCookie,
  getSessionCookieById,
  getSessionCookieByLoginName,
  removeSessionFromCookie,
} from "../cookies";

type CreateNewSessionCommand = {
  userId: string;
  idpIntent: {
    idpIntentId: string;
    idpIntentToken: string;
  };
  loginName?: string;
  password?: string;
  organization?: string;
  authRequestId?: string;
};

export async function createNewSession(options: CreateNewSessionCommand) {
  const {
    userId,
    idpIntent,
    loginName,
    password,
    organization,
    authRequestId,
  } = options;

  if (userId && idpIntent) {
    return createSessionForIdpAndUpdateCookie(
      userId,
      idpIntent,
      organization,
      authRequestId,
    );
  } else if (loginName) {
    return createSessionAndUpdateCookie(
      loginName,
      password,
      undefined,
      organization,
      authRequestId,
    );
  } else {
    throw new Error("No userId or loginName provided");
  }
}

export type UpdateSessionCommand = {
  loginName?: string;
  sessionId?: string;
  organization?: string;
  checks?: Checks;
  authRequestId?: string;
  challenges?: RequestChallenges;
};

export async function updateSession(options: UpdateSessionCommand) {
  let {
    loginName,
    sessionId,
    organization,
    checks,
    authRequestId,
    challenges,
  } = options;
  const sessionPromise = sessionId
    ? getSessionCookieById({ sessionId }).catch((error) => {
        return Promise.reject(error);
      })
    : loginName
      ? getSessionCookieByLoginName({ loginName, organization }).catch(
          (error) => {
            return Promise.reject(error);
          },
        )
      : getMostRecentSessionCookie().catch((error) => {
          return Promise.reject(error);
        });

  const host = headers().get("host");

  if (
    host &&
    challenges &&
    challenges.webAuthN &&
    !challenges.webAuthN.domain
  ) {
    challenges.webAuthN.domain = host;
  }

  const recent = await sessionPromise;

  if (recent && challenges && (!challenges.otpEmail || !challenges.otpSms)) {
    const sessionResponse = await getSession(recent.id, recent.token);

    if (sessionResponse && sessionResponse?.session?.factors?.user?.id) {
      const userResponse = await getUserByID(
        sessionResponse.session.factors.user.id,
      );
      const humanUser =
        userResponse.user?.type.case === "human"
          ? userResponse.user.type.value
          : undefined;

      if (!challenges.otpEmail && humanUser?.email?.email) {
        challenges = create(RequestChallengesSchema, {
          otpEmail: { deliveryType: { case: "sendCode", value: {} } },
        });
      }

      if (!challenges.otpEmail && humanUser?.email?.email) {
        challenges = create(RequestChallengesSchema, {
          otpSms: { returnCode: true },
        });
      }
    }
  }

  const session = await setSessionAndUpdateCookie(
    recent,
    checks,
    challenges,
    authRequestId,
  );

  // if password, check if user has MFA methods
  let authMethods;
  if (checks && checks.password && session.factors?.user?.id) {
    const response = await listAuthenticationMethodTypes(
      session.factors.user.id,
    );
    if (response.authMethodTypes && response.authMethodTypes.length) {
      authMethods = response.authMethodTypes;
    }
  }

  return {
    sessionId: session.id,
    factors: session.factors,
    challenges: session.challenges,
    authMethods,
  };
}

type ClearSessionOptions = {
  sessionId: string;
};

export async function clearSession(options: ClearSessionOptions) {
  const { sessionId } = options;

  const session = await getSessionCookieById({ sessionId });

  const deletedSession = await deleteSession(session.id, session.token);

  if (deletedSession) {
    return removeSessionFromCookie(session);
  }
}

type CleanupSessionCommand = {
  sessionId: string;
};
export async function cleanupSession({ sessionId }: CleanupSessionCommand) {
  const sessionCookie = await getSessionCookieById({ sessionId });

  const deleteResponse = await deleteSession(
    sessionCookie.id,
    sessionCookie.token,
  );

  if (!deleteResponse) {
    throw new Error("Could not delete session");
  }

  return removeSessionFromCookie(sessionCookie);
}
