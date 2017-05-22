port module Main exposing (..)

import Html exposing (Html, text, div, button, img)
import Html.Attributes exposing (id, class, classList, src)
import Html.Events exposing (onClick)
import Markdown
import Json.Decode as Json
import Http
import Tuple exposing (first)


-- LOCAL


type alias Model =
    { paragraphs : Paragraphs
    , data : List ( String, Float )
    , showChart : Bool
    , clicked : Maybe String
    }


type alias Paragraphs =
    { intro : String
    }


type alias Flags =
    { markdown : Paragraphs
    }


type Msg
    = LoadData (Result Http.Error (List ( String, Float )))
    | ToggleChart
    | BarClick ( String, Float )


main : Program Flags Model Msg
main =
    Html.programWithFlags
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


init : Flags -> ( Model, Cmd Msg )
init flags =
    Model flags.markdown [] True Nothing ! [ getData ]


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        LoadData (Ok d) ->
            { model | data = d } ! [ exportData <| List.sortBy first d ]

        LoadData (Err e) ->
            let
                le =
                    Debug.log "e" e
            in
                model ! []

        ToggleChart ->
            { model | showChart = not model.showChart } ! []

        BarClick ( letter, _ ) ->
            { model | clicked = Just letter } ! []


view : Model -> Html Msg
view { paragraphs, data, showChart, clicked } =
    div [ class "content-main" ]
        [ div [ class "splash" ]
            [ div [ class "splash-text" ] []
            , img [ src "/images/insights-masthead.png" ] []
            ]
        , div [ class "content" ]
            [ Markdown.toHtml [ class "markdown" ] paragraphs.intro
            , div [ class "button-wrap" ]
                [ div []
                    [ text <|
                        ("Click on the button to "
                            ++ (if showChart then
                                    "hide"
                                else
                                    "show"
                               )
                            ++ " the chart"
                        )
                    ]
                , button [ onClick ToggleChart ] [ text "Toggle chart" ]
                ]
            , div
                [ classList
                    [ ( "show-chart", showChart )
                    , ( "chart", True )
                    ]
                ]
                [ div [ id "d3-wrapper" ] []
                , div [ class "chart-caption" ] [ text "Letter use frequencies in English" ]
                , case clicked of
                    Just letter ->
                        div [ class "chart-annotation" ] [ text <| "The letter " ++ letter ++ " was clicked on" ]

                    _ ->
                        div [] []
                ]
            ]
        ]


decodeData : Json.Decoder (List ( String, Float ))
decodeData =
    Json.keyValuePairs Json.float


getData =
    Http.send LoadData <| Http.get "/data/data.json" decodeData


port exportData : List ( String, Float ) -> Cmd msg


port barClick : (( String, Float ) -> msg) -> Sub msg


subscriptions : Model -> Sub Msg
subscriptions model =
    barClick BarClick
