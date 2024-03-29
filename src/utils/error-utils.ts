import { Dispatch } from 'redux'
import { ResponseType } from '../api/todolists-api'
import {
    setAppErrorAC,
    setAppStatusAC,
} from '../state/reducers/app-reducer'

export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch) => {
    console.log(data)
    if (data.messages.length) {
        dispatch(setAppErrorAC({error: data.messages[0]}))
    } else {
        dispatch(setAppErrorAC({error: 'Some error occurred'}))
    }
    dispatch(setAppStatusAC({status: 'failed'}))
}

export const handleServerNetworkError = (error: { message: string }, dispatch: Dispatch) => {
    dispatch(setAppErrorAC({error: error.message}))
    dispatch(setAppStatusAC({status: 'failed'}))
}

