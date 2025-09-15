import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";

// Define the Item type
export interface Item {
    id: string;
    name: string;
    // Add other fields as needed
}

export const itemsApi=createApi({
    reducerPath:"itemsApi",
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    endpoints:(build)=>({
        getitems:build.query<Item[],string>({
            query:(q)=>({
                url:'items',
                params:{q}
            })
        })
    })
})

export const { useLazyGetitemsQuery } = itemsApi;