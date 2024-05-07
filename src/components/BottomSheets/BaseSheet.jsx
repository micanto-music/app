import React, {useCallback, useMemo, useState, useEffect} from "react";
import {COLORS, Common} from "../../styles/styles";
import {BottomSheetBackdrop, BottomSheetModal} from "@gorhom/bottom-sheet";
import {Keyboard, Platform} from "react-native";

export default function BaseSheet( {props, children} ) {
    const snapPoints = useMemo(() => props.snapPoints ? props.snapPoints : ["55%"], [children]);

    const renderBackdrop = useCallback(
        (props) => (
            <BottomSheetBackdrop
                {...props}
                style={[
                    props.style,
                    {backgroundColor: '#fff'},
                ]}
                disappearsOnIndex={-1}
            />
        ),
        []
    );
// console.log(props.name);
    return (
        <BottomSheetModal
            name={props.name}
            snapPoints={snapPoints}
            enableDynamicSizing={true}
            backdropComponent={renderBackdrop}
            style={Common.sheet.sheetModal}
            backgroundStyle={{backgroundColor: COLORS.backgroundColor}}
            handleIndicatorStyle={{backgroundColor:'#fff'}}
            ref={props.bottomSheetModalRef}
            keyboardBehavior="interactive"
        >
            {children}
        </BottomSheetModal>
    );

}
