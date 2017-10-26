import styled from "styled-components/native"
import { StyledSmallPassiveText } from "./text"

export const StyledDashboardContainer = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.offWhite};
`

export const StyledDashboardHeader = styled.View`
  background-color: ${props => props.theme.colors.white};
  padding-top: 22;
  padding-right: 24;
  padding-bottom: 12;
  padding-left: 24;
`

export const StyledDashboardHeaderRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10;
`

export const StyledCategoriesContainer = styled.View`
  padding: 8px;
`

export const StyledCategoryContainer = styled.View`
  margin-bottom: 8px;
  flex: 1;
  background-color: ${props => props.theme.colors.white};
  padding-top: 16px;
`

export const StyledCategoryHeader = styled.View`
  flex-direction: row;
  padding: 0px 16px 16px 16px;
`

export const StyledCategoryIcon = styled.Image`
  width: 74px;
  height: 74px;
`

export const StyledCategoryTextContainer = styled.View`
  margin-left: 16px;
  justify-content: center;
`

export const StyledExpandButton = styled.View`
  flex: 1;
  align-items: flex-end;
  justify-content: center;
`

export const StyledPerilsContainer = styled.View`
  border-top-color: ${props => props.theme.colors.offWhite};
  border-top-width: 1px;
  padding: 16px 0px;
  flex-wrap: wrap;
`

export const StyledPerilsRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 12px;
`

export const StyledCheckoutButton = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 32px;
`

export const StyledPeril = styled.View`
  width: 50px;
  margin-left: 22px;
  align-items: center;
`

export const StyledPerilTitle = StyledSmallPassiveText.extend`
  text-align: center;
`

export const StyledPerilIcon = styled.Image`
  width: 40px;
  height: 40px;
`

export const StyledAddRemoveIcon = styled.Image`
  position: absolute;
  top: 0;
  right: 0;
  width: 16px;
  height: 16px;
`
