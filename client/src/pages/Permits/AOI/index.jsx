import Wrapper from "components/Wrapper";
import { useTranslation } from "locale/he_IL";
import React, { useState } from "react";
import { useEffect } from "react";
import { useCallback } from "react";
import { Button, Row, Text } from "shared";
import api from 'services/api';
import * as SC from "./style";
import { Box, Input, MenuItem, Select/*, Checkbox, FormControl, InputLabel */ } from "@material-ui/core";
import Table from 'components/Table/Table';
import { useUserAoisTableColumns } from "../usePermitTableColumns";
import { CheckIfUserCanAccessPage } from "hooks";
// import { toast } from "react-toastify";

// const MAX_AOI = 5;

const AOI = () => {
    CheckIfUserCanAccessPage()

    const { t } = useTranslation()
    const [userAois, setUserAois] = useState([])
    const [allAois, setAllAois] = useState([])
    const [formData, setFormData] = useState({})
    const columns = useUserAoisTableColumns()

    useEffect(() => {
        const fetchData = () => {
            //const result = { data: [{ "id": 2, "type": "region", "name": "גזר" }, { "id": 3, "type": "region", "name": "חוף הכרמל" }, { "id": 4, "type": "region", "name": "רמת הנגב" }] }
            //return setAllAois(result.data)

            return api.get('/permit/aoi')
                .then(result => {
                    setAllAois(result.data.map((aoi) => ({ ...aoi, draft: false })))
                })
        }
        fetchData()
    }, [])

    const fetchData = () => {
        //const item = { "id": 1, "permit_aoi_id": 2, "person_id": 1, "name": "testing", "permit_aoi": { "id": 2, "type": "region", "name": "גזר", "geom": { "x": 1, "y": 1 }, "visibility": "public", "url": "", "created_at": "2023-02-07T14:16:46.000Z", "updated_at": "2023-02-07T14:16:46.000Z" } }
        //const item2 = { "id": 2, "permit_aoi_id": 2, "person_id": 1, "name": "testing", "permit_aoi": { "id": 2, "type": "region", "name": "גזר", "geom": { "x": 1, "y": 1 }, "visibility": "public", "url": "", "created_at": "2023-02-07T14:16:46.000Z", "updated_at": "2023-02-07T14:16:46.000Z" } }
        //const result = { data: [item, item2] }
        //return setUserAois(result.data)

        return api.get('/permit/aoi/person')
            .then(result => {
                setUserAois(result.data)
            })
    }

    useEffect(() => {
        fetchData();
    }, [])

    const updateFormData = (field, value) => {
        setFormData(currentState => ({
            ...currentState,
            [field]: value
        }))
    }

    const isFormValid = useCallback(() => {
        return formData?.name && formData?.permitRegion
    }, [formData])

    const addAOI = () => {
        if (!isFormValid()) {
            return
        }

        api.post('/permit/aoi/person', formData).then((permitPersonAoi) => {
            // const item = { "id": 1, "permit_aoi_id": 2, "person_id": 1, "name": "testing", "permit_aoi": { "id": 2, "type": "region", "name": "גזר", "geom": { "x": 1, "y": 1 }, "visibility": "public", "url": "", "created_at": "2023-02-07T14:16:46.000Z", "updated_at": "2023-02-07T14:16:46.000Z" } }
            setUserAois(currentState => ([
                ...currentState,
                permitPersonAoi
            ]))
        })
    }

    const deleteAOI = useCallback((item) => {
        api.delete(`/permit/aoi/person/${item.id}`).then(() => {
            setUserAois(currentState => {
                const indexToRemove = currentState.findIndex(row => row.id === item.id)
                currentState.splice(indexToRemove, 1)
                return [...currentState]
            })
        })
    }, []);

    const addDisabled = !isFormValid()

    const accessory = (row) => {
        return (
            <SC.DeleteButton ariaLabel={t.remove} onClick={() => deleteAOI(row)}>
                <SC.StyledTrashCanIcon />
            </SC.DeleteButton>
        )
    }

    return (
        <Wrapper>
            <SC.Layout>
                <SC.Content>
                    <Box>
                        <Row alignItems="baseline" justify="center">
                            <Box>
                                <Input placeholder="שם איזור עניין"
                                    value={formData.title}
                                    onChange={(e) => updateFormData('name', e.target.value)} />
                            </Box>
                            <Box sx={{ minWidth: 200 }}>
                                <Select
                                    displayEmpty
                                    fullWidth
                                    id="region-aoi-selection"
                                    labelid="region-aoi-selection-label"
                                    value={formData?.permitRegion || null}
                                    onChange={(e) => updateFormData('permitRegion', e.target.value)}
                                >
                                    <MenuItem value={null}>{t.choosePermitRegion}</MenuItem>
                                    {allAois.map(aoi => <MenuItem key={aoi.id} value={aoi.id}>{aoi.name}</MenuItem>)}
                                </Select>
                            </Box>
                            <Box>
                                <Input
                                    disabled
                                    placeholder={t.GISFileUpload} />
                            </Box>
                            <Box>
                                <Button
                                    disabled={addDisabled}
                                    small
                                    backgroundcolor='#0057AD'
                                    id="add-aoi"
                                    text={t.addAOI}
                                    onClick={addAOI}
                                />
                            </Box>
                        </Row>
                    </Box>
                    <Box sx={{ marginTop: 50 }}>
                        {userAois?.length ?

                            <Row justify="center">
                                <SC.TableContainer>
                                    <Table accessory={accessory} columns={columns} data={userAois} defaultSorting="" options={{ align: 'right' }} />
                                </SC.TableContainer>
                            </Row>

                            : <SC.NoContent>
                                <Text
                                    size="1.5rem"
                                    text={t.noAOISavedTitle}
                                    component="p"
                                />
                            </SC.NoContent>
                        }
                    </Box>
                </SC.Content>
            </SC.Layout>
        </Wrapper >
    );
}

export default AOI