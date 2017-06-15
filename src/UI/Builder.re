
let se = ReasonReact.stringToElement;

external refToCanvas: Dom.element => Canvas.canvasElement = "%identity";

let refToContext canv => {
  switch (Js.Null.to_opt canv) {
  | Some canv => Some (Canvas.getContext (refToCanvas canv))
  | None => None
  }
};

let show ctx settings => {
  open Types;
  open Settings.T;

  Random.init 0;

  let canvas_size = (1000.0, 1000.0);
  let options = Settings.to_options canvas_size settings;

  let module Board = (val (Board.tomod settings.board));
  let module Gen = (val (Alg.tomod settings.algorithm));
  let module Paint' = Paint.F Board Gen;

  let module Show' = Show.F Board Gen;

  let state = Show'.init_state options;

  Show'.loop options ctx state;
};

let animate ctx settings onStop => {
  Js.log "animate";
  open Types;
  open Settings.T;

  Random.init 0;

  let canvas_size = (1000.0, 1000.0);
  let options = Settings.to_options canvas_size settings;

  let module Board = (val (Board.tomod settings.board));
  let module Gen = (val (Alg.tomod settings.algorithm));
  let module Paint' = Paint.F Board Gen;

  let module Show' = Show.F Board Gen;

  let state = Show'.init_state options;

  let r: ref int = Show'.animate ctx settings.batch_size options state onStop;
  r
};

module Page = {
  type state = {
    settings: Settings.T.t,
    ctx: option Canvas.ctx,
    animation: option (ref int),
  };
  let component = ReasonReact.statefulComponent "Page";

  let updateCtx ref state _ => state.ctx === None ? ReasonReact.Update {...state, ctx: refToContext ref}
  : ReasonReact.NoUpdate;

  let styles = Aphrodite.create {
    "container": {
      "flex-direction": "row"
    }
  };

  let update = fun update_settings suppress_equal payload state _ => {
      let settings = update_settings payload state.settings;
      if (not suppress_equal || settings != state.settings) {
        switch (state.animation) {
        | Some id => Window.clearTimeout !id
        | _ => ()
        };
        switch (state.ctx) {
        | Some ctx => show ctx settings
        | None => ()
        };
      };
      ReasonReact.Update {...state, settings, animation: None}
  };

  let clearAnimation _ state _ => ReasonReact.Update {...state, animation: None};

  let toggle_animating _ state self => {
    switch (state.animation) {
      | Some id => {
        Window.clearTimeout !id;
        ReasonReact.Update {...state, animation: None}
      }
      | None => switch (state.ctx) {
        | Some ctx => {
          let id = (animate ctx state.settings (self.ReasonReact.update clearAnimation));
          ReasonReact.Update {...state, animation: Some id}
        }
        | None => ReasonReact.NoUpdate
      }
    };
  };

  let make _children => {
    ...component,
    didMount: fun state _ => {
      switch (state.ctx) {
        | Some ctx => show ctx state.settings
        | None => ()
      };
      ReasonReact.NoUpdate
    },
    initialState: fun () => {
      settings: Settings.initial,
      animation: None,
      ctx: None,
    },
    render: fun state self => {
      let updater = Settings.{
        update: fun update_settings suppress_equal => self.update (update update_settings suppress_equal)
      };
      <div className=(Aphrodite.css styles "container")>
        <canvas width="1000px" height="1000px" className="canvas" ref=(self.update updateCtx)/>
        <div>
        <Settings.Settings
          state=state.settings
          updater=updater
        />
        <button
          onClick=(self.update toggle_animating)
        >
          (se (state.animation === None ? "Animate" : "Stop"))
        </button>
        </div>
      </div>
    },
  };
};

let run () => {
  ReactDOMRe.renderToElementWithId <Page /> "index";
};
