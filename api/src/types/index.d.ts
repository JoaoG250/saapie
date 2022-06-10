interface UserFromRequest {
  id: string;
}

interface GraphQLContext {
  user?: UserFromRequest;
}
