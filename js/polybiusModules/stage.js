STAGE = {};

// Stage name is used to load the correct GUI
STAGE.createStages = function() {
  STAGE.stages = {};
  STAGE.stages['index'] = stageIndex;
  STAGE.stages['level1'] = stageLevel1;
  STAGE.stages['survival'] = stageSurvival;
  STAGE.stages['tutorial'] = stageTutorial;
}
