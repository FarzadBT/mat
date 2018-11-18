import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import axios from "axios";

import { DataContext } from "../common/context/DataContext";

import HomeScreen from "../use-cases/home";
import CategoryScreen from "../use-cases/category/Category";
import SushiMeScreen from "../use-cases/sushi_me";
import SushiLauScreen from "../use-cases/sushi_lau";

import {
    DigitHeader,
    DigitLayout,
    DigitTabs,
    DigitRedirect,
    DigitIfElseRendering,
    DigitLoading
} from "@cthit/react-digit-components";

import _ from "lodash";
import { Footer } from "../common/elements/footer";
import { MarginTop, Margin } from "../common-ui/layout";

class App extends Component {
    constructor() {
        super();
        this.state = {
            categories: {},
            restaurants: [],
            selected: "/"
        };
    }

    componentWillMount() {
        const endpoint =
            process.env.NODE_ENV === "development"
                ? "http://127.0.0.1:8080"
                : "";

        axios
            .get(endpoint + "/api/mat.json")
            .then(response => {
                const categories = _.groupBy(
                    response.data,
                    data => data.category
                );
                const restaurants = response.data;
                this.setState({
                    categories: categories,
                    restaurants: restaurants
                });
            })
            .catch(function(error) {
                console.log(error);
            });
    }

    onSelectedChange = selected => {
        this.props.redirectTo(selected);
        this.setState({
            selected: selected
        });
    };

    render() {
        return (
            <div>
                <Route
                    render={props => {
                        const currentPath = props.location.pathname;

                        return null;
                    }}
                />
                <DigitHeader
                    title="Mat på Johanneberg"
                    renderToolbar={() => (
                        <DigitTabs
                            selected={this.state.selected}
                            onChange={this.onSelectedChange}
                            tabs={[
                                {
                                    text: "Alla",
                                    value: "/"
                                },
                                ...Object.keys(this.state.categories).map(
                                    category => ({
                                        text: _getDisplayName(category),
                                        value: "/" + category
                                    })
                                )
                            ]}
                        />
                    )}
                    renderMain={() => (
                        <DigitLayout.Column>
                            <MarginTop />
                            <DigitIfElseRendering
                                test={this.state.restaurants.length === 0}
                                ifRender={() => (
                                    <DigitLayout.Center>
                                        <MarginTop />
                                        <MarginTop />
                                        <DigitLoading loading size={40} />
                                    </DigitLayout.Center>
                                )}
                                elseRender={() => (
                                    <DataContext.Provider value={this.state}>
                                        <DigitRedirect />
                                        <Switch>
                                            <Route
                                                component={HomeScreen}
                                                path="/"
                                                exact
                                            />
                                            <Route
                                                component={SushiMeScreen}
                                                path="/menu/sushime"
                                                exact
                                            />

                                            <Route
                                                component={SushiLauScreen}
                                                path="/menu/sushilau"
                                                exact
                                            />

                                            {Object.keys(
                                                this.state.categories
                                            ).map(category => {
                                                const path = "/" + category;
                                                return (
                                                    <Route
                                                        key={path}
                                                        path={path}
                                                        exact
                                                        render={() => (
                                                            <CategoryScreen
                                                                category={
                                                                    category
                                                                }
                                                            />
                                                        )}
                                                    />
                                                );
                                            })}
                                        </Switch>
                                    </DataContext.Provider>
                                )}
                            />
                            <Footer />
                        </DigitLayout.Column>
                    )}
                />
            </div>
        );
    }
}

const nameToDisplayNameMap = {
    pizza: "Pizza",
    thai: "Thai",
    other: "Övrigt",
    hamburger: "Hamburgare",
    sushi: "Sushi",
    baguettes: "Baguetter",
    lunch: "Lunch"
};

function _getDisplayName(categoryName) {
    return nameToDisplayNameMap[categoryName];
}

export default App;
