port module Main exposing (..)

import Html exposing (Html, text, div, button, img)
import Html.Attributes exposing (id, class, classList, src)
import Html.Events exposing (onClick)
import Markdown
import Json.Decode as Json
import Http
import Tuple exposing (..)
import Window exposing (Size, resizes)


type alias Model =
    { paragraphs : Paragraphs
    , data : List ( String, Float )
    , showChart : Bool
    , clicked1 : Maybe String
    , clicked2 : Maybe String
    }


type alias D3Data =
    { node : String
    , data : List ( String, Float )
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
    | BarClick ( String, ( String, Float ) )
    | Resize Size


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
    let
        initModel =
            Model flags.markdown [] True Nothing Nothing
    in
        initModel
            ! [ getData
              , export initModel

              -- this is a little contrived but it demonstrates the feature we want
              -- which is for the plotting function to callable multiple times
              ]


export : Model -> Cmd Msg
export model =
    exportData
        [ { node = "chart1", data = List.sortBy first model.data }
        , { node = "chart2"
          , data =
                List.reverse <|
                    List.sortBy second model.data
          }
        ]


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        LoadData (Ok d) ->
            let
                newModel =
                    { model | data = d }
            in
                newModel ! [ export newModel ]

        LoadData (Err e) ->
            let
                le =
                    Debug.log "e" e
            in
                model ! []

        ToggleChart ->
            { model | showChart = not model.showChart } ! []

        BarClick ( node, ( letter, _ ) ) ->
            case node of
                "chart1" ->
                    { model | clicked1 = Just letter } ! []

                "chart2" ->
                    { model | clicked2 = Just letter } ! []

                _ ->
                    model ! []

        Resize _ ->
            model ! [ export model ]


view : Model -> Html Msg
view { paragraphs, data, showChart, clicked1, clicked2 } =
    let
        chart v tgt =
            div [ class "chart-wrapper" ]
                [ div [ class "d3-wrapper", id v ] []
                , div [ class "chart-caption" ] [ text "Letter use frequencies in English" ]
                , case tgt of
                    Just letter ->
                        div [ class "chart-annotation" ] [ text <| "The letter " ++ letter ++ " was clicked on" ]

                    _ ->
                        div [] []
                ]
    in
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
                    , button [ onClick ToggleChart ] [ text "Toggle charts" ]
                    ]
                , div
                    [ classList
                        [ ( "show-chart", showChart )
                        , ( "chart", True )
                        ]
                    ]
                    (List.map2 chart [ "chart1", "chart2" ] [ clicked1, clicked2 ])
                ]
            ]


decodeData : Json.Decoder (List ( String, Float ))
decodeData =
    Json.keyValuePairs Json.float


getData =
    Http.send LoadData <| Http.get "/data/data.json" decodeData


port exportData : List D3Data -> Cmd msg


port barClick : (( String, ( String, Float ) ) -> msg) -> Sub msg


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ barClick BarClick
        , resizes Resize
        ]
