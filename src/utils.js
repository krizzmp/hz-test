// @flow
import { mapPropsStreamWithConfig } from 'recompose'
import rxjsConfig from 'recompose/rxjsObservableConfig'

export const mapPropsStream = mapPropsStreamWithConfig(rxjsConfig)
