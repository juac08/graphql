const graphql = require("graphql");
const _ = require("lodash");
const User = require("../Modal/User");
const Post = require("../Modal/Post");
const Hobby = require("../Modal/Hobby");

const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
} = graphql;
// var usersData = [
//   { id: "1", name: "Bond", age: 36, profession: "Programmer" },
//   { id: "13", name: "Anna", age: 26, profession: "Baker" },
//   { id: "211", name: "Bella", age: 16, profession: "Mechanic" },
//   { id: "19", name: "Gina", age: 26, profession: "Painter" },
//   { id: "150", name: "Georgina", age: 36, profession: "Teacher" },
// ];

// var hobbiesData = [
//   {
//     id: "1",
//     title: "Programming",
//     description: "Using computers to make the world a better place",
//     userId: "150",
//   },
//   {
//     id: "2",
//     title: "Rowing",
//     description: "Sweat and feel better before eating donouts",
//     userId: "211",
//   },
//   {
//     id: "3",
//     title: "Swimming",
//     description: "Get in the water and learn to become the water",
//     userId: "211",
//   },
//   {
//     id: "4",
//     title: "Fencing",
//     description: "A hobby for fency people",
//     userId: "13",
//   },
//   {
//     id: "5",
//     title: "Hiking",
//     description: "Wear hiking boots and explore the world",
//     userId: "150",
//   },
// ];

// var postsData = [
//   { id: "1", comment: "Building a Mind", userId: "1" },
//   { id: "2", comment: "GraphQL is Amazing", userId: "1" },
//   { id: "3", comment: "How to Change the World", userId: "19" },
//   { id: "4", comment: "How to Change the World", userId: "211" },
//   { id: "5", comment: "How to Change the World", userId: "1" },
// ];

const UserType = new GraphQLObjectType({
  name: "User",
  description: "Documentation for Users",
  fields: () => ({
    id: { type: graphql.GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    profession: { type: GraphQLString },
    posts: {
      type: new graphql.GraphQLList(PostType),
      resolve(parent, args) {
        // return _.filter(postsData, { userId: parent.id });
        return Post.find({ userId: parent.id });
      },
    },
    hobbies: {
      type: new graphql.GraphQLList(HobbyType),
      resolve(parent, args) {
        // return _.filter(hobbiesData, { userId: parent.id });
        return Hobby.find({ userId: parent.id });
      },
    },
  }),
});
const HobbyType = new GraphQLObjectType({
  name: "Hobby",
  description: "hello",
  fields: () => ({
    id: {
      type: graphql.GraphQLID,
    },
    title: {
      type: GraphQLString,
    },
    description: {
      type: GraphQLString,
    },
    userId: { type: graphql.GraphQLID },
    user: {
      type: UserType,
      resolve(parent, args) {
        // return _.find(usersData, { id: parent.userId });
        return User.find({ userId: parent.id });
      },
    },
  }),
});
const PostType = new GraphQLObjectType({
  name: "Post",
  description: "Comments",
  fields: () => ({
    id: { type: graphql.GraphQLID },
    comment: { type: GraphQLString },
    userId: { type: graphql.GraphQLID },
    user: {
      type: UserType,
      resolve(parent, args) {
        // return _.find(usersData, { id: parent.userId });
        return User.find({ userId: parent.id });
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  description: "",
  fields: {
    user: {
      type: UserType,
      args: {
        id: { type: graphql.GraphQLID },
      },
      resolve(parent, args) {
        return User.findById(args.id);
        // return _.find(usersData, { id: args.id });
      },
    },
    hobby: {
      type: HobbyType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parent, args) {
        // return _.find(hobbiesData, { id: args.id });
        return Hobby.findById(args.id);
      },
    },
    post: {
      type: PostType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // return _.find(postsData, { id: args.id });
        return Post.findById(args.id);
      },
    },
    users: {
      type: new graphql.GraphQLList(UserType),
      resolve(parent, args) {
        // return usersData;
        return User.find();
      },
    },
    posts: {
      type: new graphql.GraphQLList(PostType),
      resolve(parent, args) {
        // return postsData;
        return Post.find();
      },
    },
    hobbies: {
      type: new graphql.GraphQLList(HobbyType),
      resolve(parent, args) {
        // return hobbiesData;
        return Hobby.find();
      },
    },
  },
});

//Mutation

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createUser: {
      type: UserType,
      args: {
        name: { type: GraphQLString },
        profession: { type: GraphQLString },
        age: { type: GraphQLInt },
      },
      resolve(parent, args) {
        let user = new User({
          name: args.name,
          age: args.age,
          profession: args.profession,
        });
        return user.save();
      },
    },
    createPost: {
      type: PostType,
      args: {
        comment: { type: GraphQLString },
        userId: { type: GraphQLID },
      },
      resolve(parent, args) {
        let post = new Post({
          userId: args.userId,
          comment: args.comment,
        });
        // return post;
        return post.save();
      },
    },
    createHobby: {
      type: HobbyType,
      args: {
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        userId: { type: GraphQLID },
      },
      resolve(parent, args) {
        let hobby = new Hobby({
          userId: args.userId,
          title: args.title,
          description: args.description,
        });
        // return post;
        return hobby.save();
      },
    },
  },
});
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
