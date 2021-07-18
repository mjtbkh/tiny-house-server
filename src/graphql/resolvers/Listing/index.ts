import { IResolvers } from "apollo-server-express";
import { ObjectId } from "mongodb";
import { Database, Listing } from "../../../lib/types";

export const listingsResolvers: IResolvers = {
  Query: {
    listings: async (
      _root: undefined,
      _args: Record<string, never>,
      { db }: { db: Database }
    ): Promise<Listing[]> => {
      return await db.listings.find({}).toArray()
    },
    getListing: async (
      _root: undefined,
      args: { id: string },
      { db }: { db: Database }
    ): Promise<Listing> => {
      const findRes = await db.listings.findOne({
        _id: new ObjectId(args.id)
      });

      if (!findRes) throw new Error('Failed to find a listing with provided id')
      return findRes
    }
  },
  Mutation: {
    deleteListing: async (
      _root: undefined,
      { id }: { id: string },
      { db }: { db: Database }
    ): Promise<Listing> => {
      const deleteRes = await db.listings.findOneAndDelete({
        _id: new ObjectId(id),
      });

      if (!deleteRes.value) throw new Error("Failed to delete listing");
      return deleteRes.value;
    },
  },
  Listing: {
    id: (listing: Listing): string => listing._id.toString()
  }
};
