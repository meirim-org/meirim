import { Box } from "@material-ui/core";
import Wrapper from "components/Wrapper";
import { CheckIfUserCanAccessPage } from "hooks";
import { useTranslation } from "locale/he_IL";
import React, { useState } from "react";
import { useEffect } from "react";
import { useCallback } from "react";
import { Button } from "shared";
import * as SC from "./style";

const MAX_AOI = 5;

const AOI = () => {
    //CheckIfUserCanAccessPage();

    const { t } = useTranslation();
    const [items, setItems] = useState([])

    const addItem = (item) => {
        // just a temp limit...
        if (items.length > MAX_AOI) {
            return
        }

        // call api to add item....

        setItems(currentState => {
            const randId = Math.floor(Math.random() * 100);

            setItems([
                ...currentState,
                {
                    id: randId,
                    label: `label ${randId}`
                }
            ])
        })

    }

    const [activeItemIndex, setActiveItemIndex] = useState(0)

    const onClickItem = useCallback((index) => {
        setActiveItemIndex(index)
    }, [])

    const onClickTrash = useCallback((item, index) => {

        const newItems = [...items]

        if (index > -1) {
            newItems.splice(index, 1);
        }

        setItems(newItems)
    }, [items])

    useEffect(() => {
        console.log('activeItem changed:', activeItemIndex)
    }, [activeItemIndex])


    return (
        <Wrapper>
            <SC.Layout>
                <SC.Sidebar>
                    <SC.List>
                        {items.map((item, index) => (
                            <SC.Item key={item.id} onClick={() => onClickItem(index)} className={activeItemIndex === index && 'active'}>
                                <SC.ItemLabel >{item.label}</SC.ItemLabel>
                                {activeItemIndex === index &&
                                    <SC.DeleteButton ariaLabel={t.remove} onClick={() => onClickTrash(item, index)}>
                                    <SC.StyledTrashCanIcon />
                                </SC.DeleteButton>
                                }
                            </SC.Item>
                        ))}
                    </SC.List>
                    <Button
                        backgroundcolor='#0057AD'
                        id="add-aoi"
                        text={t.addAOI}
                        onClick={() => addItem()}
                        width="100%"
                    />
                </SC.Sidebar>
                <SC.Content>
                    {JSON.stringify(items[activeItemIndex])}
                </SC.Content>
            </SC.Layout>
        </Wrapper>
    );
}

export default AOI;