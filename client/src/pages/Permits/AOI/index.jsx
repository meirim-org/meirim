import Wrapper from "components/Wrapper";
import { useTranslation } from "locale/he_IL";
import React, { useState } from "react";
import { useCallback } from "react";
import { Button } from "shared";
import * as SC from "./style";

const AOI = () => {

    const items = [
        { id: 1, label: 'my label 1' },
        { id: 2, label: 'my label 2' }
    ]

    const [activeItemIndex, setActiveItemIndex] = useState(0)

    const onClickItem = useCallback((index) => {
        setActiveItemIndex(index)
    }, [])

    const onClickTrash = useCallback((item) => {
        console.log(item)
    }, [])

    const { t } = useTranslation();

    return (
        <Wrapper>
            <SC.Layout>
                <SC.Sidebar>
                    <SC.List>
                        {items.map((item, index) => (
                            <SC.Item key={item.id} onClick={() => onClickItem(index)} className={activeItemIndex === index && 'active'}>
                                <SC.ItemLabel>{item.label}</SC.ItemLabel>
                                <SC.DeleteButton onClick={() => onClickTrash(item)}>
                                    <SC.StyledTrashCanIcon />
                                </SC.DeleteButton>
                            </SC.Item>
                        ))}
                    </SC.List>
                    <Button
                        color='#0057AD'
                        id="add-aoi"
                        text={t.addAOI}
                        onClick={() => {

                        }}
                        width="100%"
                    />
                </SC.Sidebar>
            </SC.Layout>
        </Wrapper>
    );
}

export default AOI;