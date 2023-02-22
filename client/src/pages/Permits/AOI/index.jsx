import Wrapper from "components/Wrapper";
import { useTranslation } from "locale/he_IL";
import React, { useState } from "react";
import { useEffect } from "react";
import { useCallback } from "react";
import { Button, Row, Text } from "shared";
import api from 'services/api';
import * as SC from "./style";
import { Box, Checkbox, InputLabel, MenuItem, Select } from "@material-ui/core";
import Table from 'components/Table/Table';
import usePermitTableColumns from "../usePermitTableColumns";
import { CheckIfUserCanAccessPage } from "hooks";
import { toast } from "react-toastify";

const MAX_AOI = 5;

const AOI = () => {
    CheckIfUserCanAccessPage();

    const { t } = useTranslation();
    const columns = usePermitTableColumns();

    const [aois, setAois] = useState([]);
    const [allAois, setAllAois] = useState([]);

    useEffect(() => {
        const fetchData = () => {
            //const result = { data: [{ "id": 2, "type": "region", "name": "גזר" }, { "id": 3, "type": "region", "name": "חוף הכרמל" }, { "id": 4, "type": "region", "name": "רמת הנגב" }] }
            //return setAllAois(result.data)

            return api.get('/permit/aoi')
                .then(result => {
                    setAllAois(result.data.map((aoi) => ({ ...aoi, draft: false })));
                })
        }
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = () => {
            //const result = { data: [{ "id": 1, "permit_aoi_id": 2, "person_id": 1, "name": "testing", "permit_aoi": { "id": 2, "type": "region", "name": "גזר", "geom": { "x": 1, "y": 1 }, "visibility": "public", "url": "", "created_at": "2023-02-07T14:16:46.000Z", "updated_at": "2023-02-07T14:16:46.000Z" } }] }
            //return setAois(result.data)

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
            return toast.error('מצטערים, לא ניתן להוסיף יותר מ 5 איזורי עניין.', {
                position: 'bottom-center',
                autoClose: true,
                hideProgressBar: true,
                closeOnClick: true,
                draggable: true,
            });
        }

        setAois(currentState => {
            const nextId = aois.length + 1;

            setAois([
                ...currentState,
                {
                    id: nextId,
                    name: `אזור עניין ${nextId}`,
                    draft: true
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
            permit_aoi_id: aois[activeItemIndex].permit_aoi.id,
            name: aois[activeItemIndex].name
        }).then((permitPersonAoi) => {
            setAois(aois.map((aoi, index) =>
                index === activeItemIndex ? { ...aoi, id: permitPersonAoi.data.id, draft: false } : aoi
            ))
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
            if (!item.draft) {
                api.delete(`/permit/aoi/person/${item.id}`)
            }
        }

        setAois(newItems)
    }, [aois])

    useEffect(() => {
    }, [activeItemIndex])

    const previewAoi = () => {
        //const result = { data: [{ "permitId": 5490, "permitSubject": "תוספת למבנה קיים", "permitPermitCreatedAt": "2022-11-16T22:00:00.000Z", "permitRegion": "גזר", "permitRealEstate": "גוש: 4877, חלקה: 33, מגרש: 213, תוכנית: גז/157", "permitAuthor": "דוד תמיר", "permitStatus": "תשלום פקדון", "permitTimeline": "31 יום", "permitImportance": "לא מעניין", "permitUrl": null, "permitStatusUpdatedAt": "2023-01-05T23:32:43.000Z", "permitCreatedAt": "2023-01-05T23:32:43.000Z", "permitUpdatedAt": "2023-01-05T23:32:43.000Z" }, { "permitId": 5491, "permitSubject": "הסבת מבנה למגורים", "permitPermitCreatedAt": "2022-11-16T22:00:00.000Z", "permitRegion": "גזר", "permitRealEstate": "גוש: 4732, חלקה: 10, מגרש: 10, תוכנית: גז/3/16", "permitAuthor": "יעקב מוריס", "permitStatus": "פתיחה", "permitTimeline": "31 יום", "permitImportance": "לא מעניין", "permitUrl": null, "permitStatusUpdatedAt": "2023-01-05T23:32:43.000Z", "permitCreatedAt": "2023-01-05T23:32:43.000Z", "permitUpdatedAt": "2023-01-05T23:32:43.000Z" }, { "permitId": 5489, "permitSubject": "שינוי שימוש", "permitPermitCreatedAt": "2022-11-14T22:00:00.000Z", "permitRegion": "גזר", "permitRealEstate": "גוש: 4732, חלקה: 10, מגרש: 10, תוכנית: גז/3/16", "permitAuthor": "יעקב מוריס", "permitStatus": "פתיחה", "permitTimeline": "31 יום", "permitImportance": "לא מעניין", "permitUrl": null, "permitStatusUpdatedAt": "2023-01-05T23:32:43.000Z", "permitCreatedAt": "2023-01-05T23:32:43.000Z", "permitUpdatedAt": "2023-01-05T23:32:43.000Z" }] }
        //return setAois(aois.map((aoi, index) => index === activeItemIndex ? { ...aoi, previewResults: result.data } : aoi))

        api.get(`/permit/aoi/${aois[activeItemIndex].permit_aoi.id}/preview`)
            .then(result => {
                setAois(aois.map((aoi, index) => index === activeItemIndex ? { ...aoi, previewResults: result.data } : aoi))
            })
    }

    const activeAoi = aois[activeItemIndex];
    const previewResults = activeAoi?.previewResults;
    const permitAoiId = activeAoi?.permit_aoi?.id;
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
                    {activeAoi
                        ? (
                            <Box>
                                <Row alignItems="baseline" justify="right">
                                    <InputLabel id="region-aoi-selection-label"><Checkbox disabled checked={permitAoiId} />{t.choosePermitRegion}</InputLabel>
                                    <Select
                                        id="region-aoi-selection"
                                        labelId="region-aoi-selection-label"
                                        value={permitAoiId || ''}
                                        onChange={({ target: { value } }) => handleRegionChoice(value)}
                                    >
                                        {allAois.map(aoi => <MenuItem key={aoi.id} value={aoi.id}>{aoi.name}</MenuItem>)}
                                    </Select>
                                </Row>
                                <Row justify="flex-end" alignItems="center">
                                    <Box px={2} minWidth={150}>
                                        <Button
                                            backgroundcolor={!permitAoiId && "white"}
                                            disabled={!permitAoiId}
                                            id="run-preview"
                                            text="תצוגה מקדימה"
                                            onClick={previewAoi}
                                            width="100%"
                                        />
                                    </Box>
                                    <Box px={2} minWidth={150}>
                                        <Button
                                            backgroundcolor={!previewResults && "white"}
                                            disabled={!previewResults}
                                            id="save-permit-aoi"
                                            text={t.saved}
                                            onClick={savePermit}
                                            width="100%"
                                        />
                                    </Box>
                                </Row>
                                {previewResults &&
                                    <SC.TableContainer>
                                        <Table columns={columns} data={previewResults} />
                                    </SC.TableContainer>
                                }
                            </Box>
                        )
                        : <SC.NoContent>
                            <Text
                                size="1.5rem"
                                text={t.noAOISavedTitle}
                                component="p"
                            />
                        </SC.NoContent>}
                </SC.Content>
            </SC.Layout>
        </Wrapper>
    );
}

export default AOI;