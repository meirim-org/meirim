import Wrapper from "components/Wrapper";
import { CheckIfUserCanAccessPage } from "hooks";
import { useTranslation } from "locale/he_IL";
import React, { useState } from "react";
import { useEffect } from "react";
import { useCallback } from "react";
import { Button } from "shared";
import api from 'services/api';
import * as SC from "./style";
import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";

const MAX_AOI = 5;

const AOI = () => {
    CheckIfUserCanAccessPage();

    const { t } = useTranslation();
    const [aois, setAois] = useState([]);
    const [allAois, setAllAois] = useState([]);

    useEffect(() => {
        const fetchData = () => {
            // Response sample: "data":[{"id":2,"type":"region","name":"גזר"},{"id":3,"type":"region","name":"חוף הכרמל"},{"id":4,"type":"region","name":"רמת הנגב"}]
            return api.get('/permit/aoi')
                .then(result => {
                    setAllAois(result.data);
                })
        }
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = () => {
            // Response sample: "data":[{"id":1,"permit_aoi_id":2,"person_id":1,"name":"testing","permit_aoi":{"id":2,"type":"region","name":"גזר","geom":{"x":1,"y":1},"visibility":"public","url":"","created_at":"2023-02-07T14:16:46.000Z","updated_at":"2023-02-07T14:16:46.000Z"}}]
            return api.get('/permit/aoi/person')
                .then(result => {
                    setAois(result.data);
                })
        }
        fetchData();
    }, []);

    const addItem = () => {
        // just a temp limit...
        if (aois.length > MAX_AOI) {
            return
        }

        setAois(currentState => {
            const nextId = aois.length + 1;

            setAois([
                ...currentState,
                {
                    id: nextId,
                    name: `אזור עניין ${nextId}`
                }
            ])
        })

    }

    const handleRegionChoice = (id) => {
        const permit_aoi = allAois.find(aoi => aoi.id === id)
        setAois(aois.map((aoi, index) => index === activeItemIndex ? { ...aoi, permit_aoi } : aoi))
    }

    const savePermit = () => {
        api.post('/permit/aoi/person', {
            permit_aoi_id: aois[activeItemIndex].permit_aoi.id
        })
    }

    const [activeItemIndex, setActiveItemIndex] = useState(0)

    const onClickItem = useCallback((index) => {
        setActiveItemIndex(index)
    }, [])

    const onClickTrash = useCallback((item, index) => {

        const newItems = [...aois]

        if (index > -1) {
            newItems.splice(index, 1);
        }

        setAois(newItems)
    }, [aois])

    useEffect(() => {
        console.log('activeItem changed:', activeItemIndex)
    }, [activeItemIndex])

    const [previewResults, setPreviewResults] = useState([])

    const previewAoi = () => {
        // Response sample: "data":[{"permitId":5490,"permitSubject":"תוספת למבנה קיים","permitPermitCreatedAt":"2022-11-16T22:00:00.000Z","permitRegion":"גזר","permitRealEstate":"גוש: 4877, חלקה: 33, מגרש: 213, תוכנית: גז/157","permitAuthor":"דוד תמיר","permitStatus":"תשלום פקדון","permitTimeline":"31 יום","permitImportance":"לא מעניין","permitUrl":null,"permitStatusUpdatedAt":"2023-01-05T23:32:43.000Z","permitCreatedAt":"2023-01-05T23:32:43.000Z","permitUpdatedAt":"2023-01-05T23:32:43.000Z"},{"permitId":5491,"permitSubject":"הסבת מבנה למגורים","permitPermitCreatedAt":"2022-11-16T22:00:00.000Z","permitRegion":"גזר","permitRealEstate":"גוש: 4732, חלקה: 10, מגרש: 10, תוכנית: גז/3/16","permitAuthor":"יעקב מוריס","permitStatus":"פתיחה","permitTimeline":"31 יום","permitImportance":"לא מעניין","permitUrl":null,"permitStatusUpdatedAt":"2023-01-05T23:32:43.000Z","permitCreatedAt":"2023-01-05T23:32:43.000Z","permitUpdatedAt":"2023-01-05T23:32:43.000Z"},{"permitId":5489,"permitSubject":"שינוי שימוש","permitPermitCreatedAt":"2022-11-14T22:00:00.000Z","permitRegion":"גזר","permitRealEstate":"גוש: 4732, חלקה: 10, מגרש: 10, תוכנית: גז/3/16","permitAuthor":"יעקב מוריס","permitStatus":"פתיחה","permitTimeline":"31 יום","permitImportance":"לא מעניין","permitUrl":null,"permitStatusUpdatedAt":"2023-01-05T23:32:43.000Z","permitCreatedAt":"2023-01-05T23:32:43.000Z","permitUpdatedAt":"2023-01-05T23:32:43.000Z"}]
        api.get(`/permit/aoi/${aois[activeItemIndex].permit_aoi.id}/preview`)
            .then(result => {
                setPreviewResults(result.data);
            })
    }

    return (
        <Wrapper>
            <SC.Layout>
                <SC.Sidebar>
                    <SC.List>
                        {aois.map((item, index) => (
                            <SC.Item key={item.id} onClick={() => onClickItem(index)} className={activeItemIndex === index && 'active'}>
                                <SC.ItemLabel >{item.name}</SC.ItemLabel>
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
                    {aois[activeItemIndex] && (
                        <>
                            <FormControl>
                                <InputLabel id="region-aoi-selection-label">{t.permitRegion}</InputLabel>
                                <Select
                                    id="region-aoi-selection"
                                    labelId="region-aoi-selection-label"
                                    value={aois[activeItemIndex].permit_aoi?.id || ''}
                                    onChange={({ target: { value } }) => handleRegionChoice(value)}
                                    label={t.permitRegion}
                                >
                                    {allAois.map(aoi => <MenuItem key={aoi.id} value={aoi.id}>{aoi.name}</MenuItem>)}
                                </Select>
                            </FormControl>
                            <Button
                                backgroundcolor='#FCFAFF'
                                id="run-preview"
                                text="תצוגה מקדימה"
                                onClick={previewAoi}
                                width="100%"
                            />
                            <Button
                                backgroundcolor='#FCFAFF'
                                id="save-permit-aoi"
                                text={t.saved}
                                onClick={savePermit}
                                width="100%"
                            />
                        </>
                    )}
                    {JSON.stringify(previewResults)}
                </SC.Content>
            </SC.Layout>
        </Wrapper>
    );
}

export default AOI;