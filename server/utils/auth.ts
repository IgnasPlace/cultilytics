import { EventHandlerRequest, H3Event } from "h3";

export async function requireAuth(event: H3Event<EventHandlerRequest>) {
  const { user } = await requireUserSession(event);

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized.",
    });
  }

  return user;
}
