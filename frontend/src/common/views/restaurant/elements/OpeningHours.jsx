import React from "react";
import styled from "styled-components";

import { concatStrings } from "../formatter/ConcatTwoStringsFormatter";

import { Text } from "../../../../common-ui/text";
import { Spacing } from "../../../../common-ui/layout";

/**
 * openingHours is an array, every element in the array should have the following:
 * - startDay (String)
 * - endDay (String)
 * - openingHours (String)
 * - closingHours (String)
 */

export const OpeningHours = ({ openingHours }) => (
    <div>
        <Text>Öppetider:</Text>
        <Spacing />
        <Row>
            <Column align="right">
                {openingHours.map(item => (
                    <Cell key={item.startDay}>
                        <Text>
                            {concatStrings(
                                item.startDay,
                                item.endDay,
                                " - ",
                                item.startDay === item.endDay,
                                ":"
                            )}
                        </Text>
                        <Spacing />
                    </Cell>
                ))}
            </Column>
            <Spacing />
            <Column align="left">
                {openingHours.map(item => (
                    <Cell key={item.startDay + item.openingHours}>
                        <Text>
                            {concatStrings(
                                item.openingHours,
                                item.closingHours,
                                " - ",
                                item.closingHours == null,
                                ""
                            )}
                        </Text>
                        <Spacing />
                    </Cell>
                ))}
            </Column>
        </Row>
    </div>
);

const Row = styled.div`
    width: 100%;
    display: flex;
`;

const Column = styled.div`
    flex: 50%;
    text-transform: capitalize;
    text-align: ${props => (props.align != null ? props.align : "none")};
`;

const Cell = styled.div`
    display: block;
`;
