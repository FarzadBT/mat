import {
    APP_LOAD_RESTAURANTS_SUCCESSFULLY,
    APP_LOAD_RESTAURANTS_FAILED
} from "./App.actions";
import _ from "lodash";
import { loadRestaurants } from "../api/restaurants/get.restaurants.api";

export function appLoadRestaurants() {
    return dispatch => {
        loadRestaurants()
            .then(response => {
                const categories = _.groupBy(
                    response.data,
                    data => data.category
                );
                const restaurants = response.data;
                dispatch(
                    appLoadRestaurantsSuccessfully(categories, restaurants)
                );
            })
            .catch(function(error) {
                dispatch(appLoadRestaurantsFailed(error));
            });
    };
}

function appLoadRestaurantsSuccessfully(categories, restaurants) {
    return {
        type: APP_LOAD_RESTAURANTS_SUCCESSFULLY,
        payload: {
            categories: categories,
            restaurants: restaurants
        },
        error: false
    };
}

function appLoadRestaurantsFailed(error) {
    return {
        type: APP_LOAD_RESTAURANTS_FAILED,
        payload: {
            error: error
        },
        error: true
    };
}
